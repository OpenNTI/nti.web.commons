import React, {PropTypes} from 'react';
import cx from 'classnames';


Radio.propTypes = {
	checked: PropTypes.bool,
	children: PropTypes.any,
	green: PropTypes.bool,
	label: PropTypes.string,
	name: PropTypes.string
};

export default function Radio (props) {
	const {checked, children, green, label, name, ...otherProps} = props;
	return (
		<label className="radio-component" name={name}>
			<input {...otherProps} checked={Boolean(checked)} type="radio" children={void 0}/>
			<span className={cx('label', {green})}>{label}</span>
			{children && checked && (
				<div className="sub">
					{children}
				</div>
			)}
		</label>
	);
}
