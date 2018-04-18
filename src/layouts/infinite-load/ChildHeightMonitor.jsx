import React from 'react';
import PropTypes from 'prop-types';
import Logger from '@nti/util-logger';
import {matches} from '@nti/lib-dom';

const logger = Logger.get('common:layout:infinite-scroll:HeightChange');

const KNOWN_HEIGHTS = new WeakMap();

const OBSERVER_INIT = {
	childList: true,
	subtree: true
};

function getMutationObserver () {
	return window.MutationObserver || window.WebKitMutationObserver;
}

function getNodeFor (mutation, childSelector) {
	const {target} = mutation;

	if (!childSelector) {
		return target;
	}

	let node = target;

	while (node && !matches(node, childSelector)) {
		node = node.parentNode;
	}

	return node;
}


export default class ChildHeightMonitor extends React.Component {
	static propTypes = {
		childSelector: PropTypes.string,
		onHeightChange: PropTypes.func.isRequired,
		children: PropTypes.any
	}


	attachRef = (x) => {
		this.node = x;

		if (x) {
			this.startObserver();
			this.computeAllChildren();
		} else {
			this.stopObserver();
		}
	}


	constructor (props) {
		super(props);

		const MutationObserver = getMutationObserver();

		if (MutationObserver) {
			this.observer = new MutationObserver(this.onMutation);
		} else {
			logger.warn('MutationObserver is not defined onHeightChange will not trigger');
		}
	}


	onMutation = (mutations) => {
		if (!Array.isArray(mutations)) { mutations = [mutations]; }

		const {childSelector, onHeightChange} = this.props;

		for (let mutation of mutations) {
			if (mutation.target === this.node) {
				return this.computeAllChildren();
			}

			const node = getNodeFor(mutation, childSelector);

			if (!node) { continue; }

			const newHeight = node.clientHeight;
			const knownHeight = KNOWN_HEIGHTS.get(node);

			if (newHeight !== knownHeight) {
				KNOWN_HEIGHTS.set(node, newHeight);
				onHeightChange(node, newHeight);
			}
		}
	}


	computeAllChildren () {
		const {node} = this;
		const {childSelector, onHeightChange} = this.props;

		if (!childSelector) { return; }

		const children = node.querySelectorAll(childSelector);

		for (let child of children) {
			const newHeight = child.clientHeight;
			const knownHeight = KNOWN_HEIGHTS.get(child);

			if (newHeight !== knownHeight) {
				KNOWN_HEIGHTS.set(child, newHeight);
				onHeightChange(child, newHeight);
			}
		}
	}


	startObserver () {
		this.stopObserver();

		const {node, observer} = this;

		if (node && observer) {
			observer.observe(node, OBSERVER_INIT);
		}

	}


	stopObserver () {
		if (this.observer) {
			this.observer.disconnect();
		}
	}


	render () {
		const {children, ...otherProps} = this.props;

		delete otherProps.childSelector;
		delete otherProps.onHeightChange;

		return (
			<div {...otherProps} ref={this.attachRef}>
				{children}
			</div>
		);
	}
}
