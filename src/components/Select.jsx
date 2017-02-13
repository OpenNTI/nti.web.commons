import React, {PropTypes} from 'react';
import classNames from 'classnames';

export default function Select (props) {
	const {value, onChange, className, children, empty, ...otherProps} = props;
	const selectClassNames = classNames('nti-select-native', className);

	const selected = React.Children.toArray(children)
					.find(child => (
						child = child.props,
						React.Children.count(child.children) > 0 && child.value === value
					));

	let valueLabel = value;

	if (selected) {
		let {props: {children: selectedLabel}} = selected;
		if (Array.isArray(selectedLabel)) {
			selectedLabel = selectedLabel[0];
		}

		if (selectedLabel) {
			valueLabel = selectedLabel;
		}
	}

	return (
		<div className="nti-select-native-wrapper">
			<span className="icon-chevron-down small" role="presentation"/>
			<span className="nti-select-value" role="presentation">{valueLabel}</span>
			<select className={selectClassNames} {...otherProps} value={empty && value == null ? 'empty' : value} onChange={onChange}>
				{(!value && empty) && <option disabled value="empty"/>}
				{children}
			</select>
		</div>
	);
}

Select.propTypes = {
	value: PropTypes.any,
	onChange: PropTypes.func.isRequired,
	children: PropTypes.array.isRequired,
	className: PropTypes.string,
	empty: PropTypes.bool
};
