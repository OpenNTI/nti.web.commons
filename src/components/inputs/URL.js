import Url from 'url';

import React from 'react';
import PropTypes from 'prop-types';

import Text from './Text';

const defaultProtocol = 'http:';

function getFullHref (href) {
	if (!href) { return ''; }

	let parts = Url.parse(href);

	if (!parts.protocol) {
		parts.protocol = defaultProtocol;
		parts.host = href;
		parts.pathname = '';
		parts.path = '';
	}

	return Url.format(parts);
}


export default class URLInput extends React.Component {
	static getFullURL (url) {
		return getFullHref(url);
	}

	static isValidURL (url) {
		const input = Object.assign(document.createElement('input'), {type: 'url', value: getFullHref(url)});

		return input.validity.valid;
	}

	static propTypes = {
		value: PropTypes.string,
		onChange: PropTypes.func
	}


	attachInputRef = x => this.input = x;

	focus () {
		if (this.input) {
			this.input.focus();
		}
	}

	/**
	 * Since we are using a text input for usability, we create a url input
	 * to check the validity, see below for more details:
	 *
	 * https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
	 *
	 * @returns {Object} the validity of the input
	 */
	get validity () {
		const {value} = this.props;
		const input = Object.assign(document.createElement('input'), {type: 'url', value: getFullHref(value)});

		return input.validity;
	}


	onChange = (value) => {
		const {onChange} = this.props;

		if (onChange) {
			onChange(value, getFullHref(value));
		}
	}


	render () {
		const {value, ...otherProps} = this.props;

		delete otherProps.onChange;

		return (
			<Text value={value} onChange={this.onChange} ref={this.attachInputRef} {...otherProps} />
		);
	}
}
