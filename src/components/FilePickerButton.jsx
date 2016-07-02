import React, {PropTypes} from 'react';
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
	const {available, children, className, disabled, label, icon} = props;

	if ('available' in props && !available) {
		return null;
	}

	return (
		<span {...props} className={cx('button', 'file-picker', className, {disabled})} role="button" data-tip={label} aria-label={label}>
			<input type="file" {...props}/>
			<span>
				<i className={`small icon-${icon}`}/>
				<span>{children || label}</span>
			</span>
		</span>
	);
}
