import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Logger from 'nti-util-logger';

import Manager from '../ModalManager';

const logger = Logger.get('common:prompts:ManagedDialog');

class DialogWrapper extends React.PureComponent {
	static propTypes = {
		children: PropTypes.node.isRequired,
	}


	render () {
		const {children, ...props} = this.props;
		const child = React.Children.only(children);

		if (child && typeof child.type === 'string') {
			delete props.onDismiss; //silence prop warnings on dom elements
		}

		return React.cloneElement(child, props);
	}
}


export default class ManagedDialog extends React.Component {

	static propTypes = {
		children: PropTypes.any,
		className: PropTypes.string,

		// Set to false to ignore clicks/touches on the mask.
		closeOnMaskClick: PropTypes.bool,

		//Use this to update your component's state to unmount the dialog.
		onBeforeDismiss: PropTypes.func,

		restoreScroll: PropTypes.any,

		tall: PropTypes.bool,
	}

	mounted = true

	componentDidCatch (e) {
		logger.error(e.stack || e.message || e);
	}


	componentWillUnmount () {
		logger.debug('Unmounting');
		this.mounted = false;
		if (this.m) {
			this.m.dismiss();
			delete this.m;
		}
	}


	onBeforeDismiss = () => {
		const {onBeforeDismiss} = this.props;
		if (this.mounted) {
			logger.debug('Attempting to dismiss.');
			if (onBeforeDismiss) {
				onBeforeDismiss();
			}
			return false; //don't dismiss unless we unmount
		}
	}


	render () {
		const {mountPoint} = this.m || {};
		const {
			props: {
				children,
				className,
				closeOnMaskClick = true,
				restoreScroll,
				tall,
			}
		} = this;

		this.m = Manager.show(
			<DialogWrapper {...{
				children
			}}/>,
			{
				className: cx('managed-modal', className),
				onBeforeDismiss: this.onBeforeDismiss,
				closeOnMaskClick,
				restoreScroll,
				mountPoint,
				tall,
				usePortal: true,
			}
		);

		return this.m.portalRef;
	}
}
