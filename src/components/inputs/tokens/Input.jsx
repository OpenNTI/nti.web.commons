import React from 'react';
import PropTypes from 'prop-types';

import {Triggered} from '../../../flyout';
import Text from '../Text';

import {createToken, cleanTokens} from './utils';
import {ALLOW, ALLOW_EXPLICIT, DO_NOT_ALLOW} from './Constants';
import Suggestions from './Suggestions';


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

	state = {inputValue: '', suggestions: null, selectedIndex: -1}

	constructor (props) {
		super(props);

		const {getSuggestions, allowNewTokens} = props;

		if (!getSuggestions && allowNewTokens === DO_NOT_ALLOW) {
			throw new Error('Token Input without suggestions cannot also not allow new tokens');
		}
	}

	get shouldShowSuggestions () {
		const {getSuggestions, allowNewTokens} = this.props;

		return getSuggestions || allowNewTokens === ALLOW_EXPLICIT;
	}


	get selectedTokens () {
		const {value} = this.props;

		return value ? cleanTokens(value) : null;
	}


	onInputChange = value => this.setState({inputValue: value})
	onInputFocus = () => this.setState({inputFocused: true})
	onInputBlur = () => this.setState({inputFocused: false})


	render () {
		const {shouldShowSuggestions, selectedTokens} = this;
		const {getSuggestions, allowNewTokens, suggestionsLabel} = this.props;
		const {inputFocused, inputValue} = this.state;
		const input = this.renderInput(selectedTokens);

		if (!shouldShowSuggestions) {
			return input;
		}

		return (
			<Triggered
				trigger={input}
				constrain
				verticalAlign={Triggered.ALIGNMENTS.BOTTOM}
				horizontalAlign={Triggered.ALIGNMENTS.LEFT}
				open={inputFocused}
			>
				<Suggestions
					selected={selectedTokens}
					match={inputValue}
					label={suggestionsLabel}
					getSuggestions={getSuggestions}
					explicitAdd={allowNewTokens === ALLOW_EXPLICIT}
				/>
			</Triggered>

		);
	}

	renderInput () {
		const {inputValue} = this.state;

		return (
			<div>
				<Text
					ref={this.attachInputRef}
					value={inputValue}
					onChange={this.onInputChange}
					onFocus={this.onInputFocus}
					onBlur={this.onInputBlur}
				/>
			</div>
		);
	}
}
