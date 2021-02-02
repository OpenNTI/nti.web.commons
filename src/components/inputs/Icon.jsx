import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import PlaceholderLabel from './placeholder/Label';

const styles = css`
	.input-icon {
		position: relative;
		display: inline-block;

		--icon-size: 34px;
	}

	.input-icon.placeholder-label {
		display: block;
	}

	.input-icon.placeholder-label:focus-within .icon { color: var(--primary-green); }
	.input-icon.placeholder-label.box .icon { bottom: 18px;	}
	.input-icon.placeholder-label.underlined .icon { top: -4px; }

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

	.left input:not([type="checkbox"]) { padding-left: calc(var(---icon-size, 34px) + 0.25rem); }
	.left .icon { left: 0; }

	.right input:not([type="checkbox"]) { padding-right: calc(var(---icon-size, 34px) + 0.25rem); }
	.right .icon { right: 0; }
`;

const SpecialClassForInput = {
	[PlaceholderLabel]: (input) => (cx(
		styles.placeholderLabel,
		styles[input.props.variant ?? 'box'],
		{[styles.noError]: input.props.noError}
	))
};

function resolveInput (ref) {
	let pointer = ref.current;

	while (pointer?.input) {
		pointer = pointer.input;
	}

	return pointer;
}

FileIcon.propTypes = {
	className: PropTypes.string,
	children: PropTypes.any,

	icon: PropTypes.node,
	side: PropTypes.oneOf(['left', 'right']),

	_ref: PropTypes.any
};
function FileIcon ({className, children, icon, side = 'right', _ref}) {
	const input = React.Children.only(children);
	const inputClass = SpecialClassForInput[input.type]?.(input) ?? '';
	const inputRef = React.useRef(null);

	React.useImperativeHandle(_ref, () => ({
		get input () { return resolveInput(inputRef); }
	}));

	return (
		<div className={cx(styles.inputIcon, className, styles[side], inputClass)}>
			{React.cloneElement(input, {ref: inputRef})}
			{icon && (
				<div className={styles.icon}>
					{icon}
				</div>
			)}
		</div>
	);

}

const FileIconRef = (props, ref) => (
	<FileIcon {...props} _ref={ref} />
);
export default React.forwardRef(FileIconRef);
