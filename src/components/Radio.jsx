import './Radio.scss';
import PropTypes from 'prop-types';
import cx from 'classnames';

Radio.propTypes = {
	checked: PropTypes.bool,
	children: PropTypes.any,
	green: PropTypes.bool,
	label: PropTypes.node,
	name: PropTypes.string,
	disabled: PropTypes.bool,
};

export default function Radio(props) {
	const {
		checked,
		children,
		green,
		label,
		name,
		disabled,
		className,
		...otherProps
	} = props;
	return (
		<label
			className={cx('radio-component', className, { disabled })}
			name={name}
		>
			<input
				{...otherProps}
				name={name}
				checked={checked}
				type="radio"
				disabled={disabled}
			/>
			<span className={cx('label', { green })}>{label}</span>
			{children && checked && <div className="sub">{children}</div>}
		</label>
	);
}
