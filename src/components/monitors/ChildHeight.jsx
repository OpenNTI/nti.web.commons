import React from 'react';
import PropTypes from 'prop-types';
import Logger from '@nti/util-logger';
import {matches} from '@nti/lib-dom';

import {ForwardRef} from '../../decorators/';

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


export default
@ForwardRef('monitorRef')
class ChildHeightMonitor extends React.Component {
	static propTypes = {
		as: PropTypes.string,
		childSelector: PropTypes.string,
		onHeightChange: PropTypes.func.isRequired,
		children: PropTypes.any,

		monitorRef: PropTypes.func
	}


	attachRef = (x) => {
		const {monitorRef} = this.props;

		if (monitorRef) {
			monitorRef(x);
		}

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


	onLoad = () => {
		this.computeAllChildren();
	}


	startObserver () {
		this.stopObserver();

		const {node, observer} = this;

		if(this.cleanUpLoadListener) {
			this.cleanUpLoadListener();
		}

		if (node && observer) {
			observer.observe(node, OBSERVER_INIT);
		}

		if (node) {
			node.addEventListener('load', this.onLoad, true);
			this.cleanUpLoadListener = () => {
				node.removeEventListener('load', this.onLoad, true);
				this.cleanUpLoadListener = void 0;
			};
		}
	}


	stopObserver () {
		if(this.cleanUpLoadListener) {
			this.cleanUpLoadListener();
		}

		if (this.observer) {
			this.observer.disconnect();
		}
	}


	render () {
		const {children, as: tag, ...otherProps} = this.props;
		const Cmp = tag || 'div';

		delete otherProps.monitorRef;
		delete otherProps.childSelector;
		delete otherProps.onHeightChange;

		return (
			<Cmp {...otherProps} ref={this.attachRef}>
				{children}
			</Cmp>
		);
	}
}
