import React from 'react';
import cx from 'classnames';

LabeledValue.propTypes = {
	label: React.PropTypes.any,
	children: React.PropTypes.any,
	className: React.PropTypes.string
};

export default function LabeledValue (props) {
	const classes = cx('labeled-value', props.className);
	return (
		<div {...props} className={classes}>
			<label>{props.label}</label>
			<div className="value">
				{props.children}
			</div>
		</div>
	);
}
