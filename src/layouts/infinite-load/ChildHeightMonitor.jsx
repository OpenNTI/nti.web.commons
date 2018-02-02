import React from 'react';
import PropTypes from 'prop-types';
import Logger from 'nti-util-logger';

const logger = Logger.get('common:layout:infinite-scroll:HeightChange');

const OBSERVER_INIT = {
	childList: true,
};

function getMutationObserver () {
	return window.MutationObserver || window.WebKitMutationObserver;
}


export default class ChildHeightMonitor extends React.Component {
	static propTypes = {
		childSelector: PropTypes.string,
		onHeightChange: PropTypes.func,
		children: PropTypes.any
	}


	attachRef = (x) => {
		this.node = x;

		if (x) {
			this.startObserver();
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


	onMutation = () => {
		debugger;
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
