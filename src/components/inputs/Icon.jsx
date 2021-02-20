import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import PlaceholderLabel from './placeholder/Label';

const styles = stylesheet`
	.input-icon {
		position: relative;
		display: inline-block;

		--icon-size: 34px;
		--icon-gap: 2px;
	}

	.input-icon.placeholder-label {
		display: block;
	}
	.input-icon.placeholder-label.left {
		--input-padding-left: calc(
			var(--icon-size, 34px) + var(--icon-gap, 2px)
		);
	}

	.input-icon.placeholder-label:focus-within .icon {
		color: var(--primary-green);
	}
	.input-icon.placeholder-label.box .icon {
		bottom: 18px;
	}

	.input-icon.placeholder-label.underlined .icon {
		top: -4px;
	}
	.input-icon.placeholder-label.underlined.has-label .icon {
		top: -10px;
	}

	.input-icon:focus-within .icon {
		color: var(--primary-blue);
	}

	.icon {
		position: absolute;
		top: 0;
		bottom: 0;
		width: var(---icon-size, 34px);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--tertiary-grey);
	}

	.left input:not([type='checkbox']) {
		padding-left: calc(var(---icon-size, 34px) + var(--icon-gap, 2px));
	}
	.left .icon {
		left: 0;
	}

	.right input:not([type='checkbox']) {
		padding-right: calc(var(---icon-size, 34px) + var(--icon-gap, 2px));
	}
	.right .icon {
		right: 0;
	}
`;

const SpecialClassForInput = {
	[PlaceholderLabel]: input =>
		cx(styles.placeholderLabel, styles[input.props.variant ?? 'box'], {
			[styles.noError]: input.props.noError,
			[styles.hasLabel]: Boolean(input.props.label),
		}),
};

FileIcon.propTypes = {
	className: PropTypes.string,
	children: PropTypes.any,

	icon: PropTypes.node,
	side: PropTypes.oneOf(['left', 'right']),
};
export default function FileIcon({
	className,
	children,
	icon,
	side = 'right',
}) {
	const input = React.Children.only(children);
	const inputClass = SpecialClassForInput[input.type]?.(input) ?? '';

	return (
		<div
			className={cx(
				styles.inputIcon,
				className,
				styles[side],
				inputClass
			)}
		>
			{input}
			{icon && <div className={styles.icon}>{icon}</div>}
		</div>
	);
}
