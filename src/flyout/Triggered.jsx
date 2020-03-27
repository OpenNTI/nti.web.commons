import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classnames from 'classnames/bind';
import {restProps, getRefHandler} from '@nti/lib-commons';
import {addClickOutListener, addKeyboardBlurListener} from '@nti/lib-dom';

import Styles from './Triggered.css';
import Aligned from './Aligned';
import {
	VERTICAL,
	// HORIZONTAL,

	ALIGN_TOP,
	ALIGN_BOTTOM,
	ALIGN_LEFT,
	ALIGN_CENTER,
	ALIGN_RIGHT,
	ALIGN_LEFT_OR_RIGHT,

	MATCH_SIDE,

	OPEN,
	CLOSED,

	ClassHooks
} from './Constants';

const cx = classnames.bind(Styles);
const classHooks = classnames.bind(ClassHooks);

const OpenTimeout = 300;
const CloseTimeout = 300;

export default class TriggeredFlyout extends React.Component {
	static AXIS = {
		// HORIZONTAL, //Don't expost horizontal for now
		VERTICAL
	};
	
	static ALIGNMENTS = {
		TOP: ALIGN_TOP,
		BOTTOM: ALIGN_BOTTOM,
		LEFT: ALIGN_LEFT,
		CENTER: ALIGN_CENTER,
		RIGHT: ALIGN_RIGHT,
		LEFT_OR_RIGHT: ALIGN_LEFT_OR_RIGHT
	};

	static SIZES = {
		MATCH_SIDE
	};

	static OPEN = OPEN;
	static CLOSED = CLOSED;

	static propTypes = {
		trigger: PropTypes.any,
		children: PropTypes.any,
		className: PropTypes.string,
		classes: PropTypes.shape({
			open: PropTypes.string,
			closed: PropTypes.string,
			hover: PropTypes.string,
			trigger: PropTypes.string
		}),

		onDismiss: PropTypes.func,

		hover: PropTypes.oneOfType([
			PropTypes.bool,
			PropTypes.shape({
				openTimeout: PropTypes.number,
				closeTimeout: PropTypes.number
			})
		]),

		open: PropTypes.bool,
		defaultState: PropTypes.oneOf([OPEN, CLOSED]),

		menu: PropTypes.bool
	};

	static defaultProps = {
		classes: {
			arrow: classHooks('arrow'),
			closed: classHooks('closed'),
			closing: classHooks('closing'),
			dark: classHooks('dark'),
			fixed: classHooks('fixed'),
			flyout: classHooks('flyout'),
			hover: classHooks('hover'),
			open: classHooks('open'),
			opened: classHooks('opened'),
			opening: classHooks('opening'),
			trigger: classHooks('trigger'),
			wrapper: classHooks('wrapper'),
			inner: classHooks('inner'),
			bottom: classHooks('bottom'),
			top: classHooks('top'),
			center: classHooks('center'),
			left: classHooks('left'),
			right: classHooks('right'),
		},
		defaultState: CLOSED
	};

	state = {open: false}

	triggerRef = React.createRef();
	flyoutRef = React.createRef();


	componentDidMount () {
		this.mounted = true;

		if (this.props.defaultState === OPEN) {
			this.doOpen();
		}
	}

	componentDidUpdate (prevProps, prevState) {
		const {onDismiss, open:controlledOpen} = this.props;
		const {open:stateOpen} = this.state;
		const isOpen = stateOpen || controlledOpen;

		const {open: wasControlledOpen} = prevProps;
		const {open: wasStateOpen} = prevState;
		const wasOpen = wasStateOpen || wasControlledOpen;

		if (onDismiss && !isOpen && wasOpen) {
			onDismiss();
		}

		const isControlled = controlledOpen != null;
		const wasControlled = wasControlledOpen != null;

		if (isControlled !== wasControlled) {
			// eslint-disable-next-line no-console
			console.warn('Flyout was moved from controlled to uncontrolled or vice versa.');
		}
	}

	componentWillUnmount () {
		this.mounted = false;
	}

	get trigger () {
		let ref = this.triggerRef.current;

		if (!ref && this.mounted) {
			if (!this.warnedTriggerType) {
				this.warnedTriggerType = true;

				// eslint-disable-next-line no-console
				console.warn(
					'A Stateless Component null ref was returned for the Trigger. Forward its ref to the DOM node.\n%s%s',
					'See: ',
					'https://reactjs.org/docs/forwarding-refs.html#forwarding-refs-to-dom-components'
				);
			}
		}

		if (ref instanceof React.Component) {
			if (ref.getDOMNode) {
				return ref.getDOMNode();
			}

			if (!this.warnedTriggerType) {
				this.warnedTriggerType = true;
				// eslint-disable-next-line no-console
				console.warn(
					'A Component ref was returned for the Trigger.\n%s\n%s%s',
					'Implement getDOMNode() or use a Stateless Component with a forwarded ref.',
					'Ref received: ',
					ref.constructor.displayName || ref.constructor.name
				);
			}

			// eslint-disable-next-line react/no-find-dom-node
			ref = ReactDOM.findDOMNode(ref);
		}

		return ref;
	}


	get hoverTimeouts () {
		const {hover} = this.props;

		return {
			openTimeout: hover?.openTimeout ?? OpenTimeout,
			closeTimeout: hover?.closeTimeout ?? CloseTimeout
		};
	}

	isHover () {
		const {hover} = this.props;

		return Boolean(hover);
	}

	isControlled () {
		const {open} = this.props;

		return open != null;
	}

	realign (...args) {
		if (this.flyoutRef.current) {
			this.flyoutRef.current.realign(...args);
		}
	}

	doOpen (cb) {
		//If the flyout is being controlled by a prop do nothing
		if (this.isControlled()) { return; }

		if (!this.state.open) {
			this.setState({
				open: true
			}, () => {
				if (typeof cb === 'function') {
					cb();
				}
			});
		}
	}

	maybeDismiss () { if (!this.isControlled()) { this.dismiss(); }}
	dismiss (cb) { return this.doClose(cb); }
	doClose = (cb) => {
		if (this.isControlled()) { return; }

		if (this.state.open) {
			this.setState({
				open: false
			}, () => {
				if (typeof cb === 'function') {
					cb();
				}
			});
		}
	}

	doToggle (cb) {
		if (this.state.open) {
			this.doClose(cb);
		} else {
			this.doOpen(cb);
		}
	}

	onFocus () {
		this.focused = true;
	}

	onBlur () {
		clearTimeout(this.blurTimeout);

		this.blurTimeout = setTimeout(() => {
			const wasFocused = this.focused;

			this.focused = false;

			if (wasFocused && this.isHover() && this.state.open) {
				this.doClose();
			}
		}, 100);
	}

	onKeyPress (e) {
		//if we are focused and they hit enter
		if (this.focused && e.charCode === 13) {
			this.doOpen();
		}
	}

	startShow = () => {
		if (!this.isHover()) { return; }

		const {hoverTimeouts} = this;

		clearTimeout(this.showTimeout);
		clearTimeout(this.hideTimeout);

		this.showTimeout = setTimeout(() => {
			this.doOpen();
		}, hoverTimeouts.openTimeout);
	}

	startHide = () => {
		if (!this.isHover()) { return; }

		const {hoverTimeouts} = this;

		clearTimeout(this.showTimeout);
		clearTimeout(this.hideTimeout);

		this.hideTimeout = setTimeout(() => {
			this.doClose();
		}, hoverTimeouts.closeTimeout);
	}

	stopHide = () => {
		clearTimeout(this.hideTimeout);
	}

	onClick (e) {
		if (this.isHover()) { return; }

		if (e) {
			if (e.isPropagationStopped()) {
				return;
			}

			e.preventDefault();
			e.stopPropagation();
		}

		const {trigger} = this.props;

		if (trigger && trigger.props && trigger.props.onClick) {
			trigger.props.onClick(e);
		}

		this.doToggle();
	}

	onFlyoutSetup = (flyout) => {
		//If we are controlled from a prop, we don't need to listen for click out or keyboard blur
		if (this.isControlled()) { return; }

		if (this.cleanupClickOut) { this.cleanupClickOut(); }
		if (this.cleanupKeyboardBlur) { this.cleanupKeyboardBlur(); }

		this.cleanupClickOut = addClickOutListener(flyout, (e) => {
			const {trigger} = this;

			if (!this.isControlled() && trigger) {
				if (e.target !== trigger && !trigger.contains(e.target)) {
					this.doClose();
				}
			}
		});

		this.cleanupKeyboardBlur = addKeyboardBlurListener(flyout, (e) => {
			const {trigger} = this;

			this.doClose();
			trigger.focus();
		});
	}

	onFlyoutTearDown = () => {
		if (this.cleanupClickOut) { this.cleanupClickOut(); }
		if (this.cleanupKeyboardBlur) { this.cleanupKeyboardBlur(); }
	}


	onFocusOutCatch = () => {
		const {trigger} = this;

		trigger.focus();
	}


	render () {
		const {open:controlledOpen, trigger: triggerProp, classes, className, ...otherProps} = this.props;
		const {open: stateOpen} = this.state;
		const triggerProps = {...restProps(Aligned, restProps(TriggeredFlyout, otherProps))};
		const flyoutProps = {...restProps(TriggeredFlyout, otherProps), className};

		const open = stateOpen || controlledOpen;

		let Trigger = triggerProp;

		if (!this.isControlled()) {
			triggerProps.onFocus = (e) => this.onFocus(e);
			triggerProps.onBlur = (e) => this.onBlur(e);
			triggerProps.onKeyPress = (e) => this.onKeyPress(e);

			if (this.isHover()) {
				triggerProps.onMouseEnter = (e) => this.startShow(e);
				triggerProps.onMouseLeave = (e) => this.startHide(e);
			} else {
				triggerProps.onClick = (e) => this.onClick(e);
			}
		}

		if (this.isHover) {
			flyoutProps.onMouseLeave = () => this.startHide();
			flyoutProps.onMouseEnter = () => this.stopHide();
		}

		if (!Trigger || typeof Trigger === 'string') {
			Trigger = (<button>{Trigger || 'Trigger'}</button>);
		}

		const {className: triggerClassNames} = Trigger.props || {};

		triggerProps.className = cx(
			classes.trigger,
			triggerClassNames,
			className,
			{
				[classes.open]: open,
				[classes.closed]: !open
			}
		);

		//accessible props
		triggerProps.tabIndex = 0;
		triggerProps['aria-haspopup'] = this.props.menu ? 'menu' : 'dialog';

		const triggerCmp = React.isValidElement(Trigger) ?
			React.cloneElement(Trigger, {...triggerProps, ref: getRefHandler(Trigger.ref, this.triggerRef)}) :
			(<Trigger ref={this.triggerRef} {...triggerProps} />);

		return (
			<>
				{triggerCmp}
				<Aligned
					{...flyoutProps}
					ref={this.flyoutRef}
					alignTo={this.trigger}
					visible={open}
					classes={classes}
					onFlyoutSetup={this.onFlyoutSetup}
					onFlyoutTearDown={this.onFlyoutTearDown}
					focusOnOpen={!this.isHover()}
				>
					{this.renderContent()}
					<div className={cx('focus-out-catch')} tabIndex={0} aria-hidden="true" onFocus={this.onFocusOutCatch} />
				</Aligned>
			</>
		);
	}

	renderContent () {
		const {children} = this.props;

		if (React.Children.count(children) !== 1) { return children; }

		const child = React.Children.only(children);

		return typeof child.type === 'string'
			? child // dom element
			: React.cloneElement(child, {onDismiss: this.doClose}); // react component
	}
}