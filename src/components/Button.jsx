import React from 'react';
import cx from 'classnames';


Button.propTypes = {
	className: React.PropTypes.string,
	children: React.PropTypes.element,
	rounded: React.PropTypes.bool,
	onClick: React.PropTypes.func
};
export default function Button (props) {
	const {className, children, rounded, onClick = () => {}, ...otherProps} = props;
	//Add "basic" as a class, it can be removed if we need to add other style variations
	const cls = cx(className, 'basic-button', {rounded, primary: true});

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
