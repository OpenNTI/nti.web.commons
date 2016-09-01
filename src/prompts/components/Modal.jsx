import React from 'react';
import cx from 'classnames';
import Transition from 'react-addons-css-transition-group';

import LockScroll from '../../components/LockScroll';

export default class Modal extends React.Component {

	static propTypes = {
		onDismiss: React.PropTypes.func.isRequired,
		children: React.PropTypes.node,
		className: React.PropTypes.string
	}

	state = {}

	close = (e) => {
		const {onDismiss} = this.props;
		if (onDismiss) {
			onDismiss(e);
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
				<div ref={(x) => this.mask = x} className={classes}>
					<i className="icon-close" onClick={this.close}/>
					<div className="modal-content">
						{c}
					</div>
				</div>
			</Transition>
		);
	}

}
