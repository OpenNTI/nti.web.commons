import React from 'react';
import cx from 'classnames';

AddButton.propTypes = {
	label: React.PropTypes.string,
	className: React.PropTypes.string,
	onClick: React.PropTypes.func,
	error: React.PropTypes.bool
};
export default function AddButton ({label = 'Add To', onClick = () => {}, className, error}) {
	const cls = cx('association-add-button', className, {error});

	return (
		<div className={cls} onClick={onClick}>
			{label}
		</div>
	);
}
