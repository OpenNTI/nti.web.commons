import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

FilePickerButton.propTypes = {
	available: PropTypes.bool,
	className: PropTypes.string,
	children: PropTypes.any,
	disabled: PropTypes.bool,
	icon: PropTypes.string,
	label: PropTypes.string
};

export default function FilePickerButton (props) {
	const {available, children, className, disabled, label, icon, ...otherProps} = props;

	if ('available' in props && !available) {
		return null;
	}

	return (
		<span {...otherProps} className={cx('button', 'file-picker', className, {disabled})} role="button" data-tip={label} aria-label={label}>
			<input type="file" {...otherProps}/>
			<span>
				<i className={`small icon-${icon}`}/>
				<span>{children || label}</span>
			</span>
		</span>
	);
}
