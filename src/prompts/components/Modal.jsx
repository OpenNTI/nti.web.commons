import React from 'react';
import cx from 'classnames';
import Transition from 'react-addons-css-transition-group';

import LockScroll from '../../components/LockScroll';

const stop = e => e.stopPropagation();

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

	render () {
		const {children, className} = this.props;

		const content = React.Children.only(children);
		const c = React.cloneElement(content, {onDismiss: this.close});

		const classes = cx('modal-mask', className);

		return (
			<Transition transitionName="modal-mask"
				transitionAppear
				transitionLeave
				transitionAppearTimeout={500}
				transitionEnterTimeout={500}
				transitionLeaveTimeout={500}
			>
				<LockScroll />
				<div ref={(x) => this.mask = x} className={classes} onTouchStart={stop} onTouchMove={stop} onClick={this.onMaskClick}>
					<i className="icon-close" onClick={this.close}/>
					<div ref={x => this.content = x} className="modal-content">
						{c}
					</div>
				</div>
			</Transition>
		);
	}

}
