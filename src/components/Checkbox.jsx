import React, {PropTypes} from 'react';

Checkbox.propTypes = {
	label: PropTypes.string,
	checked: PropTypes.bool,
	children: PropTypes.any,
	name: PropTypes.string
};

export default function Checkbox (props) {
	return (
		<label className="checkbox-component" name={props.name}>
			<input {...props} type="checkbox" children={void 0}/>
			<span className="label">{props.label}</span>
			{props.children && props.checked && (
				<div className="sub">
					{props.children}
				</div>
			)}
		</label>
	);
}
