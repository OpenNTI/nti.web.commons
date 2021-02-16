import React from 'react';
import PropTypes from 'prop-types';
import { rawContent } from '@nti/lib-commons';

function attributesToString(attributes) {
	if (!attributes) {
		return '';
	}

	const keys = Object.keys(attributes);

	let str = '';

	for (let key of keys) {
		str += `${key}="${attributes[key]}" `;
	}

	return str;
}

const DATA_ATTR = 'data-uncontrolled-placeholder';
const PLACEHOLDER_TPL = attributes => {
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
		as: PropTypes.any,

		onMount: PropTypes.func,
		onUnmount: PropTypes.func,
	};

	componentWillUnmount() {
		const { onUnmount, ...otherProps } = this.props;

		if (onUnmount) {
			onUnmount(this.placeholder, otherProps);
		}
	}

	attachContainer = node => {
		//execute call backs in the next event pump;
		setTimeout(() => {
			const { onMount, ...otherProps } = this.props;

			this.placeholder = node
				? node.querySelector(`[${DATA_ATTR}]`)
				: null;

			if (!this.node && node) {
				if (onMount) {
					onMount(this.placeholder, otherProps);
				}
			}

			this.node = node;
		}, 1);
	};

	render() {
		const { attributes, as: tag, ...otherProps } = this.props;
		const tpl = PLACEHOLDER_TPL(attributes);
		const Cmp = tag || 'div';

		delete otherProps.onMount;
		delete otherProps.onUnmount;

		return (
			<Cmp
				{...otherProps}
				ref={this.attachContainer}
				{...rawContent(tpl)}
			/>
		);
	}
}
