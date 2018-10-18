import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Logger from '@nti/util-logger';
import uuid from 'uuid/v4';

import Manager from './ModalManager';

const logger = Logger.get('common:prompts:ManagedDialog');

/**
 * Managed Dialog Component Framework. Any child of this component will
 * be rendered into a modal portal.
 *
 * This sits atop the ModalManager which allows out-of-flow prompts
 * but this component locks the Modal to the lifecycle of ___this___ component. (By disallowing
 * dismissals without unmounting this instance)
 *
 * @class Dialog
 * @component
 */
export default class Dialog extends React.Component {

	static propTypes = {
		/** @ignore */
		children: PropTypes.any,
		/** @ignore */
		className: PropTypes.string,

		/** Set to false to ignore clicks/touches on the mask. */
		closeOnMaskClick: PropTypes.bool,

		/** Set to false to ignore the escape key */
		closeOnEscape: PropTypes.bool,

		/** Called to request dismissal of the modal. */
		onBeforeDismiss: PropTypes.func,

		/** Enables scroll memoization and restoration */
		restoreScroll: PropTypes.any,

		/**
		 * By default modals are centered on the screen. This will override that and align
		 * the modal to the top of the screen
		 */
		tall: PropTypes.bool,
	}

	mounted = true

	componentDidCatch (e) {
		/* istanbul ignore next */
		logger.error(e.stack || e.message || e);
	}


	componentDidMount () {
		this.uuid = uuid();
		this.rollbackCountStateKey = this.uuid + '-rollbackCount';

		global.addEventListener('popstate', this.onHistory);
		this.onHistory();
	}


	componentWillUnmount () {
		logger.debug('Un-mounting');
		this.mounted = false;
		const { rollbackCountStateKey: key } = this;
		const { history, document: { title } } = global;
		const { ...state } = history.state || {};

		// On Unmount remove our date and unregister our handler.
		global.removeEventListener('popstate', this.onHistory);

		delete state[key];

		history.replaceState(state, title);

		/* istanbul ignore else */
		if (this.m) {
			this.m.dismiss();
			delete this.m;
		}
	}


	onHistory = (e) => {
		const { rollbackCountStateKey: key } = this;
		const { history, document: { title } } = global;
		const {
			[key]: rollbackCount = null,
			...state
		} = history.state || {};

		this.rollbackCount = ((this.rollbackCount || 0) + 1); //local increment...

		// This looks unintuitive, but forward navigation does not have a 'state' value, so we have to track forward
		// motions internally. Events from "back/forward" will have the state of that entry (so we should take it as is)
		// So this code sets the state to itself, or our incremented value... then assigns that back to our internal
		// value.
		this.rollbackCount = state[key] = rollbackCount || this.rollbackCount;

		history.replaceState(state, title);

		logger.debug('History Entry changed: %o', state);
	}


	/* Call this to roll history back to before the dialog was opened */
	rollback () {
		const { rollbackCountStateKey: key } = this;
		const { history } = global;
		const { state } = history;
		const { [key]: rollbackCount } = state || {};

		logger.debug('Requested to roll-back history by: %o', rollbackCount);
		// If we have data in the history.state, use it instead...
		/* istanbul ignore else */
		if (rollbackCount > 0) {
			history.go(-rollbackCount);
		}
	}


	onBeforeDismiss = () => {
		const {onBeforeDismiss} = this.props;
		if (this.mounted) {
			logger.debug('Attempting to dismiss.');
			/* istanbul ignore else */
			if (onBeforeDismiss) {
				onBeforeDismiss({
					rollback: () => this.rollback()
				});
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
				closeOnEscape = true,
				restoreScroll,
				tall,
			}
		} = this;

		this.m = Manager.show(children,
			{
				className: cx('managed-modal', className),
				onBeforeDismiss: this.onBeforeDismiss,
				closeOnMaskClick,
				closeOnEscape,
				restoreScroll,
				mountPoint,
				tall,
				usePortal: true
			}
		);

		return this.m.portalRef;
	}
}
