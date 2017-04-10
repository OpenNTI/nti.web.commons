import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

LabeledValue.propTypes = {
	label: PropTypes.any,
	children: PropTypes.any,
	className: PropTypes.string,
	arrow: PropTypes.bool,
	disabled: PropTypes.bool
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
