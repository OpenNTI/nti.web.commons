import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import {Triggered} from '../../../flyout';
import Text from '../Text';

import Styles from './Input.css';
import {createToken, cleanTokens} from './utils';
import {ALLOW, ALLOW_EXPLICIT, DO_NOT_ALLOW} from './Constants';
import keyDownStateMod from './input-key-down-state-modifier';
import Suggestions from './components/Suggestions';
import Token from './components/Token';

const cx = classnames.bind(Styles);

export default class NTITokenInput extends React.Component {
	static createToken = createToken

	static ALLOW = ALLOW
	static ALLOW_EXPLICIT = ALLOW_EXPLICIT
	static DO_NOT_ALLOW = DO_NOT_ALLOW

	static propTypes = {
		className: PropTypes.string,
		light: PropTypes.bool,

		value: PropTypes.array,
		onChange: PropTypes.func,

		placeholder: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.shape({
				empty: PropTypes.string,
				hasTokens: PropTypes.string
			})
		]),

		delimiters: PropTypes.arrayOf(PropTypes.string),
		validator: PropTypes.func,
		maxTokenLength: PropTypes.number,


		getSuggestions: PropTypes.func,
		suggestionsLabel: PropTypes.string,

		allowNewTokens: PropTypes.oneOf([
			ALLOW,
			ALLOW_EXPLICIT,
			DO_NOT_ALLOW
		]),

		inputTransform: PropTypes.func
	}

	static defaultProps = {
		allowNewTokens: ALLOW,
		delimiters: ['Enter', 'Tab', ' ', ',']
	}

	attachInputRef = x => this.input = x;
	attachFlyout = x => this.flyout = x;
	attachSuggestions = x => this.suggestions = x;

	state = {}

	constructor (props) {
		super(props);

		const {getSuggestions, allowNewTokens} = props;

		if (!getSuggestions && allowNewTokens === DO_NOT_ALLOW) {
			throw new Error('Token Input without suggestions cannot also not allow new tokens');
		}

		this.state = {
			inputValue: '',
			focused: null,
			tokens: props.value ? cleanTokens(props.value) : []
		};
	}


	componentDidUpdate (prevProps) {
		const {value} = this.props;
		const {value: oldValue} = prevProps;

		if (value !== oldValue) {
			this.setState({
				tokens: value ? cleanTokens(value) : []
			}, () => this.realign());
		}
	}

	focus () {
		return this.input && this.input.focus();
	}

	realign () {
		return this.flyout && this.flyout.realign();
	}

	get shouldShowSuggestions () {
		const {getSuggestions, allowNewTokens} = this.props;

		return getSuggestions || allowNewTokens === ALLOW_EXPLICIT;
	}


	get tokens () {
		return this.state.tokens;
	}

	get placeholder () {
		const {placeholder} = this.props;
		const {tokens} = this.state;

		if (!placeholder || typeof placeholder === 'string') { return placeholder; }

		return placeholder[tokens.length > 0 ? 'withTokens' : 'empty'];
	}


	onInputChange = (pendingValue) => {
		const {validator, inputTransform} = this.props;
		const value = inputTransform ? inputTransform(pendingValue) : pendingValue;
		const inputValidity = validator ? validator(value) : null;

		this.setState({
			inputValue: value,
			inputValidity
		});
	}

	onInputKeyDown = (e) => {
		const oldState = this.state;
		const newState = keyDownStateMod(e, oldState);

		if (newState.tokens !== this.state.tokens) {
			this.onChange(newState.tokens);
		}


		if (oldState !== newState) {
			console.log('Updating State: ', newState.inputValue);
			this.setState(newState);
		}
		
		if (this.suggestions) {
			this.suggestions.onInputKeyDown(e);
		}
	}

	onInputFocus = () => {
		clearTimeout(this.blurTimeout);

		const {inputFocused} = this.state;

		if (!inputFocused) {
			this.setState({inputFocused: true});
		}
	}

	onInputBlur = () => {
		if (!this.state.inputFocused) { return; }

		this.blurTimeout = setTimeout(() => {
			this.setState({inputFocused: false});
		}, 500);
	}


	onChange (tokens, clearInput) {
		const finishChange = () => {
			const {onChange} = this.props;

			if (onChange) {
				onChange(tokens.map(t => t.wasRaw ? t.value : t));
			}

			this.focus();
		};

		if (clearInput) {
			console.log('CLEARING INPUT');
			this.setState({inputValue: ''}, finishChange);
		} else {
			finishChange();
		}
	}


	addToken = (token, clearInput) => {
		const {tokens} = this.state;

		for (let selected of tokens) {
			if (selected.isSameToken(token)) { return; }
		}

		this.onChange([...tokens, token], clearInput);
	}


	removeToken = (token, clearInput) => {
		const {tokens} = this.state;
		const filtered = tokens.filter((selected) => !selected.isSameToken(token));

		if (filtered.length !== tokens) {
			return this.onChange(filtered, clearInput);
		}
	}


	render () {
		const {shouldShowSuggestions} = this;
		const {inputFocused, focused} = this.state;
		const input = this.renderInput();

		if (!shouldShowSuggestions) {
			return input;
		}

		return (
			<Triggered
				ref={this.attachFlyout}
				trigger={input}
				constrain
				verticalAlign={Triggered.ALIGNMENTS.BOTTOM}
				horizontalAlign={Triggered.ALIGNMENTS.LEFT}
				open={inputFocused && !focused}
			>
				{this.renderSuggestions()}
			</Triggered>

		);
	}

	renderInput () {
		const {className, light, maxTokenLength} = this.props;
		const {inputValue, inputValidity, tokens, focused} = this.state;
		const error = inputValidity && !inputValidity.isValid;

		return (
			<div className={cx('nti-token-input', className, {light})}>
				<ul className={cx('token-list')}>
					{tokens.map((token, index) => {
						const isFocused = focused && token.isSameToken(focused);

						return (
							<li key={index}>
								<Token
									token={token}
									focused={isFocused}
									onRemove={this.removeToken}
								/>
							</li>
						);
					})}
					<li>
						<Text
							className={cx('nti-token-text-input', {error})}
							ref={this.attachInputRef}
							value={inputValue}
							placeholder={this.placeholder}
							onChange={this.onInputChange}
							onFocus={this.onInputFocus}
							onBlur={this.onInputBlur}
							onKeyDown={this.onInputKeyDown}
							maxLength={maxTokenLength}
						/>
					</li>
				</ul>
			</div>
		);
	}


	renderSuggestions () {
		const {getSuggestions, allowNewTokens, suggestionsLabel} = this.props;
		const {inputValue, inputValidity, tokens} = this.state;

		return (
			<Suggestions
				ref={this.attachSuggestions}
				selected={tokens}
				match={inputValue}
				matchValidity={inputValidity}
				label={suggestionsLabel}
				getSuggestions={getSuggestions}
				explicitAdd={allowNewTokens === ALLOW_EXPLICIT}
				addToken={this.addToken}
				removeToken={this.removeToken}
			/>
		);
	}
}
