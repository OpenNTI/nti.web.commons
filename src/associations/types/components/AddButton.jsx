import React from 'react';
import cx from 'classnames';

AddButton.propTypes = {
	label: React.PropTypes.string,
	className: React.PropTypes.string,
	onAdd: React.PropTypes.func
};
export default function AddButton ({label = 'Add To', onAdd = () => {}, className}) {
	const cls = cx('association-add-button', className);

	return (
		<div className={cls} onClick={onAdd}>
			{label}
		</div>
	);
}
