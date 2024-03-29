import './Checkbox.scss';
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
		PropTypes.object, // rendered element
	]),
	name: PropTypes.string,
	domRef: PropTypes.any,
};

function Checkbox(props) {
	const {
		checked,
		disabled,
		children,
		green,
		label,
		name,
		domRef,
		['data-testid']: testid,
		...otherProps
	} = props;
	return (
		<label
			data-testid={testid}
			className={cx('checkbox-component', { disabled })}
			name={name}
			ref={domRef}
		>
			<input
				{...otherProps}
				name={name}
				checked={checked}
				disabled={disabled}
				type="checkbox"
			/>
			<span className={cx('label', { green })}>{label}</span>
			{children && checked && <div className="sub">{children}</div>}
		</label>
	);
}

export default React.forwardRef((props, ref) => (
	<Checkbox {...props} domRef={ref} />
));
