import React from 'react';
import cx from 'classnames';

LabeledValue.propTypes = {
	label: React.PropTypes.any,
	children: React.PropTypes.any,
	className: React.PropTypes.string,
	arrow: React.PropTypes.bool,
	disabled: React.PropTypes.bool
};

export default function LabeledValue (props) {
	const {arrow, children, className, label, disabled, ...otherProps} = props;
	const classes = cx('labeled-value', className, {
		'arrow-down': arrow,
		disabled
	});

	return (
		<div {...otherProps} className={classes}>
			<label>{label}</label>
			<div className="value">
				{children}
			</div>
		</div>
	);
}
