import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';

const DEFAULT_TEXT = {
	tryAgain: 'Try Again'
};

const t = scoped('ASSOCIATION_ADD_BUTTON', DEFAULT_TEXT);

AddButton.propTypes = {
	label: PropTypes.string,
	className: PropTypes.string,
	onClick: PropTypes.func,
	error: PropTypes.bool,
	disabled: PropTypes.bool
};
export default function AddButton ({label = 'Add To', onClick = () => {}, className, error, disabled}) {
	const cls = cx('association-add-button', className, {error, disabled});

	return (
		<div className={cls} onClick={onClick}>
			{error ? t('tryAgain') : label}
		</div>
	);
}
