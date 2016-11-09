import React from 'react';
import cx from 'classnames';
import Transition from 'react-addons-css-transition-group';
import isIOS from 'nti-util-ios-version';
import {declareCustomElement} from 'nti-lib-dom';

import LockScroll from '../../components/LockScroll';

import Manager from '../ModalManager';

declareCustomElement('dialog');

const stop = e => e.stopPropagation();

const needsSafariFix = e => e && (isIOS() && /input|textarea|select/i.test(e.target.tagName));


export default class Modal extends React.Component {

	static propTypes = {
		onDismiss: React.PropTypes.func.isRequired,
		children: React.PropTypes.node,
		className: React.PropTypes.string,
		closeOnMaskClick: React.PropTypes.bool,
		tall: React.PropTypes.bool
	}


	static childContextTypes = {
		close: React.PropTypes.func
	}


	getChildContext = () => ({
		close: this.close
	})


	state = {}


	componentDidMount () {
		Manager.addUpdateListener(this.onManagerUpdate);
		this.focus();
	}


	componentWillUnmount () {
		Manager.removeUpdateListener(this.onManagerUpdate);
	}


	onManagerUpdate = () => this.forceUpdate()


	close = (e) => {
		const {onDismiss} = this.props;
		if (e) {
			e.stopPropagation();
		}
		if (onDismiss) {
			onDismiss(e);
		}
	}


	focus = () => {
		this.content.focus();
	}


	onMaskClick = (e) => {
		const {closeOnMaskClick} = this.props;
		if (closeOnMaskClick && (e.target === this.mask || e.target === this.content)) {
			this.close(e);
		}
	}


	onFocus = (e) => {
		if (needsSafariFix(e)) {
			this.setState({safariFix: true});
		}
	}


	onBlur = (e) => {
		if (needsSafariFix(e)) {
			this.setState({safariFix: false});
		}
	}


	render () {
		const {children, className, tall} = this.props;
		const {safariFix} = this.state;
		const hidden = Manager.isHidden(this);

		const classes = cx('modal-mask', className, {hidden, 'safari-fix': safariFix, tall});

		return (
			<Transition transitionName="modal-mask"
				transitionAppear
				transitionLeave
				transitionAppearTimeout={500}
				transitionEnterTimeout={500}
				transitionLeaveTimeout={500}
			>
				<LockScroll />
				<div ref={(x) => this.mask = x} className={classes}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					onTouchStart={stop}
					onTouchMove={stop}
					onClick={this.onMaskClick}
					>
					<i className="icon-close" onClick={this.close}/>
					<dialog role="dialog" className="modal-content" open ref={x => this.content = x} tabIndex="-1">
						{React.cloneElement(
							React.Children.only(children),
							{ onDismiss: this.close }
						)}
					</dialog>
				</div>
			</Transition>
		);
	}

}
