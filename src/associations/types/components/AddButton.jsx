import React from 'react';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';

const DEFAULT_TEXT = {
	tryAgain: 'Try Again'
};

const t = scoped('ASSOCIATION_ADD_BUTTON', DEFAULT_TEXT);

AddButton.propTypes = {
	label: React.PropTypes.string,
	className: React.PropTypes.string,
	onClick: React.PropTypes.func,
	error: React.PropTypes.bool,
	disabled: React.PropTypes.bool
};
export default function AddButton ({label = 'Add To', onClick = () => {}, className, error, disabled}) {
	const cls = cx('association-add-button', className, {error, disabled});

	return (
		<div className={cls} onClick={onClick}>
			{error ? t('tryAgain') : label}
		</div>
	);
}
