import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classnames from 'classnames/bind';
import {restProps} from '@nti/lib-commons';
import {addClickOutListener} from '@nti/lib-dom';

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
			open: classHooks('open'),
			closed: classHooks('closed'),
			hover: classHooks('hover'),
			trigger: classHooks('trigger')
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
			if (ref.getDomNode) {
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

			ref = ReactDOM.findDomNode(ref);
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

	dismiss (cb) { return this.doClose(cb); }
	doClose (cb) {
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
			this.focused = false;
		}, 100);
	}

	onKeyPress (e) {
		//if we are focused and they hit enter
		if (this.focused && e.charCode === 13) {
			this.doOpen();
		}
	}

	onMouseEnter () {
		if (!this.isHover()) { return; }

		const {hoverTimeouts} = this;

		clearTimeout(this.showTimeout);
		clearTimeout(this.hideTimeout);

		this.showTimeout = setTimeout(() => {
			this.doOpen();
		}, hoverTimeouts.openTimeout);
	}

	onMouseLeave () {
		if (!this.isHover()) { return; }

		const {hoverTimeouts} = this;

		clearTimeout(this.showTimeout);
		clearTimeout(this.hideTimeout);

		this.hideTimeout = setTimeout(() => {
			this.doClose();
		}, hoverTimeouts.closeTimeout);
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
		if (this.cleanupClickOut) { this.cleanupClickOut(); }

		this.cleanupClickOut = addClickOutListener(flyout, (e) => {
			const {trigger} = this;

			if (!this.isControlled() && trigger) {
				if (e.target !== trigger && !trigger.contains(e.target)) {
					this.doClose();
				}
			}
		});
	}

	onFlyoutTearDown = () => {
		if (this.cleanupClickOut) { this.cleanupClickOut(); }
	}


	render () {
		const {open:controlledOpen, trigger: triggerProp, classes, className, ...otherProps} = this.props;
		const {open: stateOpen} = this.state;
		const triggerProps = {...restProps(TriggeredFlyout, otherProps)};
		const flyoutProps = {...restProps(TriggeredFlyout, otherProps)};

		const open = stateOpen || controlledOpen;

		let Trigger = triggerProp;

		if (!this.isControlled()) {
			triggerProps.onFocus = (e) => this.onFocus(e);
			triggerProps.onBlur = (e) => this.onBlur(e);
			triggerProps.onKeyPress = (e) => this.onKeyPress(e);

			if (this.isHover()) {
				triggerProps.onMouseEnter = (e) => this.onMouseEnter(e);
				triggerProps.onMouseLeave = (e) => this.onMouseLeave(e);
			} else {
				triggerProps.onClick = (e) => this.onClick(e);
			}
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
		triggerProps.tabindex = 0;
		triggerProps['aria-haspopup'] = this.props.menu ? 'menu' : 'dialog';

		const triggerCmp = React.isValidElement(Trigger) ?
			React.cloneElement(Trigger, {...triggerProps, ref: this.triggerRef}) :
			(<Trigger ref={this.triggerRef} {...triggerProps} />);

		return (
			<>
				{triggerCmp}
				{this.trigger && (
					<Aligned
						{...flyoutProps}
						ref={this.flyoutRef}
						alignTo={this.trigger}
						visible={open}
						onFlyoutSetup={this.onFlyoutSetup}
						onFlyoutTearDown={this.onFlyoutTearDown}
					>
						{this.renderContent()}
					</Aligned>
				)}
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