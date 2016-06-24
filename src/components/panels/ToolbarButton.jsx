import React, {PropTypes} from 'react';
import cx from 'classnames';
import isActionable from 'nti-commons/lib/is-event-actionable';

const HANDLERS = new WeakMap();
const disable = (e) => (e.preventDefault(),e.stopPropagation());

ToolbarButton.propTypes = {
	checked: PropTypes.bool,
	children: PropTypes.any,
	className: PropTypes.string,
	disabled: PropTypes.bool,
	icon: PropTypes.string,
	label: PropTypes.string,
	onClick: PropTypes.func
};

export default function ToolbarButton (props) {
	const {checked, children, className, disabled, icon, label} = props;
	const toggle = ('checked' in props);

	const onClick = getHandler(props.onClick);

	return (
		<a {...props}
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
		result = (e) => isActionable(e) && fn(e);
		HANDLERS.set(fn, result);
	}

	return result;
}
