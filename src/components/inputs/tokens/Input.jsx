import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import {Triggered} from '../../../flyout';
import Text from '../Text';

import Styles from './Input.css';
import {createToken, cleanTokens} from './utils';
import {ALLOW, ALLOW_EXPLICIT, DO_NOT_ALLOW} from './Constants';
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

		value: PropTypes.array,
		onChange: PropTypes.func,

		delimiters: PropTypes.arrayOf(PropTypes.string),

		getSuggestions: PropTypes.func,
		suggestionsLabel: PropTypes.string,

		allowNewTokens: PropTypes.oneOf([
			ALLOW,
			ALLOW_EXPLICIT,
			DO_NOT_ALLOW
		])
	}

	static defaultProps = {
		allowNewTokens: ALLOW,
		delimiters: ['Enter', 'Tab', ' ', ',']
	}

	attachInputRef = x => this.input = x;
	attachFlyout = x => this.flyout = x;

	state = {inputValue: '', suggestions: null, selectedIndex: -1}

	constructor (props) {
		super(props);

		const {getSuggestions, allowNewTokens} = props;

		if (!getSuggestions && allowNewTokens === DO_NOT_ALLOW) {
			throw new Error('Token Input without suggestions cannot also not allow new tokens');
		}

		this.state = {
			inputValue: '',
			suggestions: null,
			selectedIndex: -1,
			selectedTokens: props.value ? cleanTokens(props.value) : []
		};
	}


	componentDidUpdate (prevProps) {
		const {value} = this.props;
		const {value: oldValue} = prevProps;

		if (value !== oldValue) {
			this.setState({
				selectedTokens: value ? cleanTokens(value) : []
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


	get selectedTokens () {
		return this.state.selectedTokens;
	}


	onInputChange = value => this.setState({inputValue: value})
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
		const {onChange} = this.props;

		if (onChange) {
			onChange(tokens.map(t => t.wasRaw ? t.value : t));
		}

		if (clearInput) {
			this.setState({inputValue: ''});
		}

		this.focus();
	}


	addToken = (token, clearInput) => {
		const {selectedTokens} = this.state;

		for (let selected of selectedTokens) {
			if (selected.isSameToken(token)) { return; }
		}

		this.onChange([...selectedTokens, token], clearInput);
	}


	removeToken = (token, clearInput) => {
		const {selectedTokens} = this.state;
		const filtered = selectedTokens.filter((selected) => !selected.isSameToken(token));

		if (filtered.length !== selectedTokens) {
			return this.onChange(filtered, clearInput);
		}
	}


	render () {
		const {shouldShowSuggestions} = this;
		const {inputFocused} = this.state;
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
				open={inputFocused}
			>
				{this.renderSuggestions()}
			</Triggered>

		);
	}

	renderInput () {
		const {className} = this.props;
		const {inputValue, selectedTokens} = this.state;

		return (
			<div className={cx('nti-token-input', className)}>
				<ul className={cx('token-list')}>
					{selectedTokens.map((token, index) => {
						return (
							<li key={index}>
								<Token token={token} onRemove={this.removeToken} />
							</li>
						);
					})}
					<li>
						<Text
							className={cx('nti-token-text-input')}
							ref={this.attachInputRef}
							value={inputValue}
							onChange={this.onInputChange}
							onFocus={this.onInputFocus}
							onBlur={this.onInputBlur}
						/>
					</li>
				</ul>
			</div>
		);
	}


	renderSuggestions () {
		const {getSuggestions, allowNewTokens, suggestionsLabel} = this.props;
		const {inputValue, selectedTokens} = this.state;

		return (
			<Suggestions
				selected={selectedTokens}
				match={inputValue}
				label={suggestionsLabel}
				getSuggestions={getSuggestions}
				explicitAdd={allowNewTokens === ALLOW_EXPLICIT}
				addToken={this.addToken}
				removeToken={this.removeToken}
			/>
		);
	}
}
