import React from 'react';
import PropTypes from 'prop-types';
import {rawContent} from '@nti/lib-commons';

function attributesToString (attributes) {
	if (!attributes) { return ''; }

	const keys = Object.keys(attributes);

	let str = '';

	for (let key of keys) {
		str += `${key}="${attributes[key]}" `;
	}

	return str;
}

const DATA_ATTR = 'data-uncontrolled-placeholder';
const PLACEHOLDER_TPL = (attributes) => {
	return `<div ${DATA_ATTR} ${attributesToString(attributes)}></div>`;
};

/*
 * Sometimes it is necessary to get a div that is not being controlled by react. It should be
 * extremely rare, but there are a few cases where it is unavoidable. Mixing extjs and react
 * together is one of the main cases we have right now, so instead of repeating this logic in
 * a bunch of different places, we made this component.
 */
export default class Uncontrolled extends React.Component {
	static propTypes = {
		attributes: PropTypes.object,

		onMount: PropTypes.func,
		onUnmount: PropTypes.func
	}


	attachContainer = (node) => {
		//execute call backs in the next event pump;
		setTimeout(() => {
			const {onMount, onUnmount, ...otherProps} = this.props;

			this.placeholder = node ? node.querySelector(`[${DATA_ATTR}]`) : null;

			if (!this.node && node) {
				this.node = node;
				if (onMount) { onMount(this.placeholder, otherProps); }
			} else if (this.node && !node) {
				this.node = null;
				if (onUnmount) { onUnmount(this.placeholder, otherProps); }
			}
		}, 1);
	}


	render () {
		const {attributes, ...otherProps} = this.props;
		const tpl = PLACEHOLDER_TPL(attributes);

		delete otherProps.onMount;
		delete otherProps.onUnmount;

		return (
			<div
				{...otherProps}
				ref={this.attachContainer}
				{...rawContent(tpl)}
			/>
		);
	}
}
