import React from 'react';
import cx from 'classnames';

export default function Modal (props) {

	const {children, onDismiss, className} = props;

	function close (e) {
		if (onDismiss) {
			onDismiss(e);
		}
	}
	const content = React.Children.only(children);
	const c = React.cloneElement(content, {onDismiss: close});

	const classes = cx('modal-mask', className);

	return (
		<div className={classes}>
			<i className="icon-close" onClick={close}/>
			<div className="modal-content">
				{c}
			</div>
		</div>
	);

}

Modal.propTypes = {
	onDismiss: React.PropTypes.func.isRequired,
	children: React.PropTypes.node,
	className: React.PropTypes.string
};
