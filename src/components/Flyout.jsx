import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

import {getViewportHeight, getViewportWidth, getScrollParent} from 'nti-lib-dom';

const {createElement: ce} = global.document || {};
const makeDOM = o => ce && Object.assign(ce.call(document, o.tag || 'div'), o);

function getRect (el) {
	const p = e => e && e.offsetParent;
	const r = e => p(e) ? [e].concat(r(p(e))) : [e];
	const sum = (a, e) => (a.top += e.offsetTop, a.left += e.offsetLeft, a);

	return r(el).reduce(sum, {
		left: 0,
		top: 0,
		width: el.offsetWidth,
		height: el.offsetHeight,
		get right () { return this.left + this.width; },
		get bottom () { return this.top + this.height; }
	});
}

function getAlignments (str) {
	str = str.toLowerCase();
	const [vert, horz] = str.split('-');

	const VALID_VERT = /^top|middle|bottom$/;
	const VALID_HORZ = /^left|center|right$/;

	return {
		horizontal: VALID_HORZ.test(horz) ? horz : 'left',
		vertical: VALID_VERT.test(vert) ? vert : 'bottom'
	};
}


const ALIGNERS = {

	top (dim, {top}) {
		return {
			side: 'top',
			top: Math.round(top - dim) + 'px'
		};
	},

	middle (dim, {top, height}) {
		return {
			side: 'middle',
			top: Math.round((top + (height / 2)) - (dim / 2)) + 'px'
		};
	},

	bottom (dim, {bottom}) {
		return {
			side: 'bottom',
			top: Math.round(bottom) + 'px'
		};
	},



	left (dim, {left}) {
		return {
			side: 'left',
			left: Math.round(left) + 'px'
		};
	},

	center (dim, {left, width}) {
		return {
			left: Math.round((left + (width / 2)) - (dim / 2)) + 'px',
			side: 'center'
		};
	},

	right (dim, {left, width}) {
		return {
			side: 'right',
			left: Math.round((left + width) - dim) + 'px'
		};
	}
};


export default class Flyout extends React.Component {

	static propTypes = {
		trigger: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.node
		]),
		children: PropTypes.any,
		className: PropTypes.string,
		alignment: PropTypes.string,
		afterAlign: PropTypes.func
	}

	static defaultProps = {
		alignment: 'bottom center'
	}

	constructor (props) {
		super(props);
		this.state = {alignment: {}};
		this.fly = makeDOM({className: cx('fly-wrapper', props.className)});
		this.onToggle = this.onToggle.bind(this);
		this.attachTriggerRef = ref => this.trigger = ref;
		this.attachFlyoutRef = this.attachFlyoutRef.bind(this);
		this.maybeDismiss = this.maybeDismiss.bind(this);

		this.realign = () => {
			clearTimeout(this.realign.timeout);
			this.realign.timeout = setTimeout(()=> this.align(), 200);
		};
	}


	componentDidMount () {
		document.body.appendChild(this.fly);
	}


	componentWillUnmount () {
		ReactDOM.unmountComponentAtNode(this.fly);
		document.body.removeChild(this.fly);
	}


	componentWillReceiveProps (nextProps) {
		if (nextProps.className !== this.props.className) {
			this.fly.className = cx('fly-wrapper', nextProps.className);
		}
	}


	componentDidUpdate (/*prevProps, prevState*/) {
		const {open} = this.state;

		if (open) {
			this.renderFlyout();
		} else {
			ReactDOM.unmountComponentAtNode(this.fly);
		}
	}


	maybeDismiss (e, cb) {
		const {target} = e || {};
		const {trigger, flyout, state: {open}} = this;
		const finish = () => typeof cb === 'function' && cb();

		if (e && (!trigger || !flyout || !open || target === trigger || trigger.contains(target))) {
			return finish();
		}

		if (!e || (!flyout.contains(target) && flyout !== target)) {
			this.setState({open: false, aligning: true}, finish);
		} else {
			finish();
		}
	}


	listenToScroll (scroller) {
		const {scrollparent: old} = this;
		if (old === scroller) {
			return;
		}

		if (old) {
			old.removeEventListener('scroll', this.realign);
		}

		delete this.scrollparent;

		if (scroller) {
			scroller.addEventListener('scroll', this.realign);
			this.scrollparent = scroller;
		}
	}


	attachFlyoutRef (ref) {

		if (ref && !this.flyout) {
			window.addEventListener('resize', this.realign);
			window.document.addEventListener('click', this.maybeDismiss);
			this.listenToScroll(getScrollParent(ref) || window);
		} else if (!ref) {
			window.removeEventListener('resize', this.realign);
			window.document.removeEventListener('click', this.maybeDismiss);
			this.listenToScroll(null);
		}

		this.flyout = ref;

		if (!ref) {return;}

		this.align();
	}


	align (cb = this.props.afterAlign, noRetry = false) {
		const rect = getRect(this.trigger);
		const {offsetWidth: width, offsetHeight: height} = this.flyout || {};

		function flip (a) {
			return ({
				center: 'left',
				middle: 'bottom',
				left: 'right',
				top: 'bottom'
			})[a] || a;
		}

		const finish = () => {
			this.setState(
				{aligning: false},
				typeof cb === 'function' ? cb : void cb);
		};

		const calculateAlignment = (alignments, attempts = 1) => {
			const y = ALIGNERS[alignments.vertical](height, rect);
			const x = ALIGNERS[alignments.horizontal](width, rect);

			const alignment = {...y, ...x};

			alignment.side = {[x.side]: 1, [y.side]: 1};

			this.setState({alignment}, () => {
				const {top, left, right, bottom} = this.flyout.getBoundingClientRect();
				const {vertical, horizontal} = alignments;
				let realignments = alignments;

				if (left < 0 || right > getViewportWidth()) {
					realignments = Object.assign({}, alignments, {horizontal: flip(horizontal)});
				}

				if (top < 0 || bottom > getViewportHeight()) {
					realignments = Object.assign({}, alignments, {vertical: flip(vertical)});
				}

				if (noRetry || alignments === realignments || attempts >= 3) {
					finish();
				} else {
					calculateAlignment(realignments, attempts + 1);
				}
			});
		};

		if (!this.flyout) {
			return finish();
		}

		calculateAlignment(getAlignments(this.props.alignment));
	}


	onToggle (e, cb) {
		if (e) {
			if (e.isPropagationStopped()) {
				return;
			}

			e.preventDefault();
			e.stopPropagation();
		}

		const {open} = this.state;

		this.setState(
			{ open: !open, aligning: true },
			typeof cb === 'function' ? cb : void cb);
	}


	render () {
		const props = Object.assign({}, this.props, {children: void 0});
		let {trigger: Trigger} = this.props;

		if (!Trigger) {
			Trigger = ( <button>Trigger</button> );
		}

		if (Trigger.type instanceof React.Component || typeof Trigger.type === 'string') {
			const {onClick} = Trigger.props;
			let onToggle = this.onToggle;
			if (onClick) {
				onToggle = e => {
					onClick(e);
					this.onToggle(e);
				};
			}

			return React.cloneElement(Trigger, {ref: this.attachTriggerRef, onClick: onToggle});
		}

		return (
			<Trigger {...props} ref={this.attachTriggerRef} onClick={this.onToggle}/>
		);
	}


	renderFlyout () {
		const {props: {children, className}, state: {aligning, alignment}} = this;

		const style = {
			position: 'absolute',
			visibility: aligning ? 'hidden' : void 0,
			border: '1px solid red',
			top: alignment.top,
			left: alignment.left
		};

		const css = cx('flyout', className, alignment.side);

		ReactDOM.render(
			<div className={css} ref={this.attachFlyoutRef} style={style}>
				{children}
			</div>
		, this.fly);
	}
}
