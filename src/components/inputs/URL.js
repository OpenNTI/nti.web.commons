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
