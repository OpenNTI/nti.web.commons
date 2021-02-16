import React from 'react';
import PropTypes from 'prop-types';
import Logger from '@nti/util-logger';

const logger = Logger.get('common:sync-height:HeightChange');

const OBSERVER_INIT = {
	childList: true,
	characterData: true,
	subtree: true,
};

function getMutationObserver() {
	return window.MutationObserver || window.WebKitMutationObserver;
}

export default class HeightMonitor extends React.Component {
	static propTypes = {
		children: PropTypes.node,
		onChange: PropTypes.func,
	};

	attachRef = x => {
		this.node = x;

		if (x) {
			this.startObserver();
		} else {
			this.stopObserver();
		}
	};

	constructor(props) {
		super(props);

		const mutationObserver = getMutationObserver();

		this.currentHeight = -1;

		if (mutationObserver) {
			this.observer = new mutationObserver(() => this.maybeChanged());
		} else {
			logger.warn(
				'Mutation Observer is not defined, onChange will not be called'
			);
		}
	}

	get height() {
		const { node } = this;

		return node ? 0 : node.clientHeight;
	}

	componentDidUpdate() {
		this.maybeChange();
	}

	componentWillUnmount() {
		this.stopObserver();
	}

	maybeChanged() {
		const { onChange } = this.props;

		if (!onChange) {
			return;
		}

		setTimeout(() => {
			const { height: newHeight } = this;

			if (newHeight !== this.currentHeight) {
				this.currentHeight = newHeight;
				onChange(newHeight);
			}
		}, 1); //Wait for the dom to settle down
	}

	startObserver() {
		this.stopObserver();
		const { node, height } = this;

		this.currentHeight = height;

		if (this.observer && node) {
			this.observer.observe(node, OBSERVER_INIT);
		}
	}

	stopObserver() {
		if (this.observer) {
			this.observer.disconnect();
		}
	}

	render() {
		const { children, ...otherProps } = this.props;

		delete otherProps.onChange;

		return (
			<div {...otherProps} ref={this.attachRef}>
				{children}
			</div>
		);
	}
}
