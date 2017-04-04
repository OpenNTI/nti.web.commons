import React from 'react';
import cx from 'classnames';


Button.propTypes = {
	className: React.PropTypes.string,
	children: React.PropTypes.node,
	rounded: React.PropTypes.bool,
	onClick: React.PropTypes.func,
	disabled: React.PropTypes.bool,
};
export default function Button (props) {
	const {className, children, rounded, disabled, onClick = () => {}, ...otherProps} = props;
	//Add "basic" as a class, it can be removed if we need to add other style variations
	const cls = cx(className, 'basic-button', {rounded, primary: true, disabled});

	return (
		<a {...otherProps}
			className={cls}
			role="button"
			onClick={onClick}
			>
			{children}
		</a>
	);
}
