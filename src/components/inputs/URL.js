import Url from 'url';

import React from 'react';

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
		value: React.PropTypes.string,
		onChange: React.PropTypes.func
	}


	get validity () {
		const {value} = this.props;
		const input = Object.assign(document.createElement, {type: 'url', value: getFullHref(value)});

		return input.validity;
	}


	onChange = (value) => {
		const {onChange} = this.props;

		if (onChange) {
			onChange(value, getFullHref(value));
		}
	}


	render () {
		const {value, onChange, ...otherProps} = this.props;

		return (
			<Text value={value} onChange={onChange} {...otherProps} />
		);
	}
}
