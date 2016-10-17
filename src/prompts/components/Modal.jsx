import React from 'react';
import cx from 'classnames';
import Transition from 'react-addons-css-transition-group';
import isIOS from 'nti-util-ios-version';

import LockScroll from '../../components/LockScroll';

const stop = e => e.stopPropagation();

const needsSafariFix = e => e && (isIOS() && /input|textarea|select/i.test(e.target.tagName));


export default class Modal extends React.Component {

	static propTypes = {
		onDismiss: React.PropTypes.func.isRequired,
		children: React.PropTypes.node,
		className: React.PropTypes.string,
		closeOnMaskClick: React.PropTypes.bool
	}

	state = {}

	close = (e) => {
		const {onDismiss} = this.props;
		if (e) {
			e.stopPropagation();
		}
		if (onDismiss) {
			onDismiss(e);
		}
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
		const {children, className} = this.props;
		const {safariFix} = this.state;

		const classes = cx('modal-mask', className, {'safari-fix': safariFix});

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
					<div ref={x => this.content = x} className="modal-content">
						{React.cloneElement(
							React.Children.only(children),
							{ onDismiss: this.close }
						)}
					</div>
				</div>
			</Transition>
		);
	}

}
