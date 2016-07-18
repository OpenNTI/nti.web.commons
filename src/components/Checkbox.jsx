import React, {PropTypes} from 'react';
import cx from 'classnames';

Checkbox.propTypes = {
	checked: PropTypes.bool,
	children: PropTypes.any,
	green: PropTypes.bool,
	label: PropTypes.string,
	name: PropTypes.string
};

export default function Checkbox (props) {
	const {checked, children, green, label, name, ...otherProps} = props;
	return (
		<label className="checkbox-component" name={name}>
			<input {...otherProps} name={name} checked={checked} type="checkbox" children={void 0}/>
			<span className={cx('label', {green})}>{label}</span>
			{children && checked && (
				<div className="sub">
					{children}
				</div>
			)}
		</label>
	);
}
