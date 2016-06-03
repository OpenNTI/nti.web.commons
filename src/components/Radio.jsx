import React, {PropTypes} from 'react';

Radio.propTypes = {
	label: PropTypes.string,
	checked: PropTypes.bool,
	children: PropTypes.any
};

export default function Radio (props) {
	return (
		<label className="radio">
			<input {...props} type="radio" children={void 0}/>
			<span className="label">{props.label}</span>
			{props.children && props.checked && (
				<div className="sub">
					{props.children}
				</div>
			)}
		</label>
	);
}
