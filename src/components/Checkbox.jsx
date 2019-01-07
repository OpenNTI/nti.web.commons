import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

Checkbox.propTypes = {
	checked: PropTypes.bool,
	disabled: PropTypes.bool,
	children: PropTypes.any,
	green: PropTypes.bool,
	label: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.object // rendered element
	]),
	name: PropTypes.string,
};

function Checkbox (props, domRef) {
	const {checked, disabled, children, green, label, name, ...otherProps} = props;
	return (
		<label className={cx('checkbox-component', {disabled})} name={name} ref={domRef}>
			<input {...otherProps} name={name} checked={checked}
				disabled={disabled} type="checkbox"/>
			<span className={cx('label', {green})}>{label}</span>
			{children && checked && (
				<div className="sub">
					{children}
				</div>
			)}
		</label>
	);
}


export default React.forwardRef(Checkbox);
