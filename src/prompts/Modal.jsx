import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import isIOS from '@nti/util-ios-version';
import { declareCustomElement } from '@nti/lib-dom';

import LockScroll from '../components/LockScroll';

declareCustomElement('dialog');


const needsSafariFix = e => e && (isIOS() && /input|textarea|select/i.test(e.target.tagName));
const stopEvent = e => e && e.stopPropagation();

/**
 * This is the Modal Shell of a dialog or prompt. Do not use this directly unless
 * you really want to manage the lower levels.
 *
 * If you are looking to lauch a modal, see {@link Dialog}
 *
 * @private This class should be considered impementation detail of ModalManager.
 * @class Modal
 */
export default class Modal extends React.Component {

	static propTypes = {
		/** @ignore */
		children: PropTypes.any,
		/** @ignore */
		className: PropTypes.string,

		/**
		 * A ModalManager instance.
		 * @private
		 * @ignore
		 * @type {ModalManager}
		 */
		Manager: PropTypes.object.isRequired,

		/**
		 * Sent by ModalManager
		 * @ignore
		 * @type {Boolean}
		 */
		isPortal: PropTypes.bool,

		/**
		 * A callback to call on requesting a dismissal.
		 *
		 * @private
		 * @ignore
		 * @type {function}
		 */
		onDismiss: PropTypes.func.isRequired,

		/**
		 * Enable the click listener on the mask that will call onDismiss.
		 *
		 * @private
		 * @ignore
		 * @type {boolean}
		 */
		closeOnMaskClick: PropTypes.bool,

		/**
		 * Don't center the dialog. Position it at the top instead.
		 *
		 * @private
		 * @ignore
		 * @type {boolean}
		 */
		tall: PropTypes.bool
	}


	static childContextTypes = {
		close: PropTypes.func
	}

	/* @ignore */
	attachContentRef = x => this.content = x


	getChildContext = () => ({
		close: this.close
	})


	constructor (props) {
		super(props);

		this.props.Manager.addUpdateListener(this.onManagerUpdate);
		this.state = { staging: true };
	}

	componentDidMount () {
		// Staging is here because the ref content isn't set when the modal manager calls isHidden in the render.
		// We set state for another render to occur and correctly call isHidden with a set ref.
		this.setState({ staging: false }, () => this.focus());
	}

	componentWillUnmount () {
		this.props.Manager.removeUpdateListener(this.onManagerUpdate);
	}


	onManagerUpdate = () => !this.props.isPortal && this.forceUpdate()


	/**
	 * @param {object} e - the event
	 * @returns {undefined}
	 */
	close = (e) => {
		const {onDismiss} = this.props;

		stopEvent(e);

		/* istanbul ignore else */
		if (onDismiss) {
			onDismiss(e);
		}
	}


	focus = () => {
		this.content.focus();
	}


	/**
	 * @param {object} e - the event
	 * @returns {undefined}
	 */
	onMaskClick = (e) => {
		const {closeOnMaskClick} = this.props;
		if (closeOnMaskClick) {
			this.close(e);
		}
	}

	/**
	 * @param {object} e - the event
	 * @returns {undefined}
	 */
	onFocus = (e) => {
		if (needsSafariFix(e)) {
			this.setState({safariFix: true});
		}
	}

	/**
	 * @param {object} e - the event
	 * @returns {undefined}
	 */
	onBlur = (e) => {
		if (needsSafariFix(e)) {
			this.setState({safariFix: false});
		}
	}


	render () {
		const {Manager, children, className, tall} = this.props;
		const {safariFix} = this.state;
		const hidden = Manager.isHidden(this);

		const classes = cx('modal-mask', className, {hidden, 'safari-fix': safariFix, tall});

		const ios = isIOS();
		const timeout = 500;


		return (
			<>
				<LockScroll />
				<TransitionGroup>
					<CSSTransition
						key={className}
						classNames="modal-mask"
						timeout={timeout}
						appear={!ios}
						enter={!ios}
						exit={!ios}
					>
						<div
							className={classes}
							onFocus={this.onFocus}
							onBlur={this.onBlur}
							onClick={this.onMaskClick}
						>
							<i className="icon-close" onClick={this.close}/>
							<dialog role="dialog" className="modal-content" open ref={this.attachContentRef} tabIndex="-1" onClick={stopEvent}>
								{React.Children.map(children, child =>
									typeof child.type === 'string'
										? child
										: React.cloneElement(child, { onDismiss: this.close })
								)}
							</dialog>
						</div>
					</CSSTransition>
				</TransitionGroup>
			</>
		);
	}

}
