import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Events} from '@nti/lib-commons';

const HANDLERS = new WeakMap();
const disable = (e) => (e.preventDefault(),e.stopPropagation());

ToolbarButton.propTypes = {
	available: PropTypes.bool,
	checked: PropTypes.bool,
	children: PropTypes.any,
	className: PropTypes.string,
	disabled: PropTypes.bool,
	icon: PropTypes.string,
	label: PropTypes.string,
	onClick: PropTypes.func
};

export default function ToolbarButton (props) {
	const {available, checked, children, className, disabled, icon, label, ...otherProps} = props;
	const toggle = ('checked' in props);
	const onClick = getHandler(props.onClick);

	if ('available' in props && !available) {
		return null;
	}

	return (
		<a {...otherProps}
			role="button"
			className={cx('toolbar-button', className, {disabled, toggle, checked})}
			data-tip={label}
			aria-label={label}
			onClick={disabled ? disable : onClick}
			onKeyDown={disabled ? disable : onClick}
			tabIndex={!disabled ? 0 : void 0}
		>
			<i className={`small icon-${icon}`}/>
			<span>{children || label}</span>
		</a>
	);
}



function getHandler (fn) {
	if (!fn) { return; }

	let result = HANDLERS.get(fn);
	if (!result) {
		result = (e) => Events.isActionable(e) && (fn(e), e.target.blur());
		HANDLERS.set(fn, result);
	}

	return result;
}
