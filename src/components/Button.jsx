import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Events, PropTypes as NtiPropTypes } from '@nti/lib-commons';

import { filterProps } from '../utils/filter-props';

import styles from './Button.css';

/**
 * @param {Object} props
 * @param {*} props.as Change the default element this component renders with.
 * @param {*} props.component Deprecated: use 'as'
 * @param {string} props.className
 * @param {boolean} props.rounded
 * @param {boolean} props.disabled
 * @param {boolean} props.secondary
 * @param {boolean} props.destructive
 * @param {boolean} props.inverted
 * @param {boolean} props.plain
 * @param {(e: Event) => void} props.onClick
 * @param {React.RefObject} ref
 * @returns {JSX.Element}
 */
const ButtonImpl = (
	{
		/**@deprecated use as instead */
		component,

		as: Component = component || 'a',
		className,
		rounded,
		disabled,
		secondary,
		destructive,
		inverted,
		plain,
		onClick,
		...otherProps
	},
	ref
) => {
	const handleTrigger = e => {
		// This handler is called for clicks, and keyDown.
		// This filter only allows "clicks" from physical clicks and "keyDown" events from Space or Enter.
		if (disabled || !Events.isActionable(e)) {
			if (disabled) {
				e.preventDefault();
				e.stopPropagation();
			}
			return false;
		}

		if (onClick) {
			onClick(e);
		}
	};

	const cls = cx('nti-button', className, {
		[styles.button]: !plain,
		[styles.primary]: !secondary && !destructive && !plain,
		[styles.secondary]: secondary,
		[styles.destructive]: destructive,
		[styles.disabled]: disabled,
		[styles.rounded]: rounded,
		[styles.inverted]: inverted,
		plain,
	});

	return (
		<Component
			ref={ref}
			role="button"
			tabIndex="0"
			{...filterProps(otherProps, Component)}
			className={cls}
			onKeyDown={handleTrigger}
			onClick={handleTrigger}
		/>
	);
};

const Button = React.forwardRef(ButtonImpl);

Button.propTypes = {
	as: PropTypes.any,
	component: NtiPropTypes.deprecated,
	className: PropTypes.string,
	onClick: PropTypes.func,

	rounded: PropTypes.bool,
	disabled: PropTypes.bool,
	secondary: PropTypes.bool,
	destructive: PropTypes.bool,
	inverted: PropTypes.bool,
	plain: PropTypes.bool,
};

export default Button;
