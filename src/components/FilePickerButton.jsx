import React, {PropTypes} from 'react';
import cx from 'classnames';

ToolbarButton.propTypes = {
	className: PropTypes.string,
	children: PropTypes.any,
	disabled: PropTypes.bool,
	icon: PropTypes.string,
	label: PropTypes.string
};

export default function ToolbarButton (props) {
	const {children, className, disabled, label, icon} = props;
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
