import './Select.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';


Select.propTypes = {
	value: PropTypes.any,
	placeholder: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	children: PropTypes.array.isRequired,
	className: PropTypes.string,
	empty: PropTypes.bool,
	domRef: PropTypes.func
};

export default function Select (props) {
	const {value, placeholder, onChange, className, children, empty, domRef, ...otherProps} = props;
	const selectClassNames = cx('nti-select-native', className);

	const selected = React.Children.toArray(children)
		.find(child => (
			child = child.props,
			React.Children.count(child.children) > 0 && child.value === value
		));

	let valueLabel = value || placeholder;

	if (selected) {
		const labelElements = React.Children.map(selected.props.children, (c) => typeof c !== 'object' ? c : React.cloneElement(c));
		if (labelElements) {
			valueLabel = labelElements;
		}
	}

	return (
		<div className="nti-select-native-wrapper" ref={domRef}>
			<span className="icon-chevron-down small" role="presentation"/>
			<span className={cx('nti-select-value', {placeholder: !value})} role="presentation">{valueLabel}</span>
			<select className={selectClassNames} {...otherProps} value={empty && value == null ? 'empty' : value} onChange={onChange}>
				{(!value && empty) && <option disabled value="empty"/>}
				{children}
			</select>
		</div>
	);
}

const ForwardedRefSelect = (props, ref) => (
	<Select {...props} domRef={ref} />
);

Select.ForwardRef = React.forwardRef(ForwardedRefSelect);
