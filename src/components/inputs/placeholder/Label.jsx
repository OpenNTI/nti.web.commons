import React, { useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { v4 as getId } from 'uuid';

import Text from '../../../text';
import { Message } from '../../../errors';

import Box from './frames/Box';
import Underline from './frames/Underline';

const styles = stylesheet`
	@custom-selector :--inputs input:not([type="checkbox"]);

	.container {
		--text-smaller: 0.875rem;
		--padding-horizontal: 0;
		--border: 1px solid;
		--transition-time: 0.2s;

		display: block;
		font-family: var(--body-font-family);
		line-height: 1.375;

		/* Clear the base input styles, since we need to define them on the container */
		& :--inputs {
			border-radius: 0;
			background: none;

			/* Boo !important but we need to override some mobile styles */
			border: var(--border, 1px solid) transparent !important;

			/* again overriding mobile styles */
			box-shadow: none;
			color: inherit;
			font: inherit;
			padding: 0;
			height: auto;
		}
	}
`;

const ErrorMessage = styled(Message)`
	display: block;
	margin: 0.125rem 0 var(--padding-horizontal, 0.625rem);
	padding: 0 var(--padding-horizontal, 0.625rem);
	font-size: 0.75rem;
`;

Label.propTypes = {
	className: PropTypes.string,
	label: PropTypes.any,
	error: PropTypes.any,

	locked: PropTypes.bool,
	center: PropTypes.bool,
	noError: PropTypes.bool,
	fill: PropTypes.bool,

	variant: PropTypes.oneOf(['box', 'underlined']),
	as: PropTypes.any,

	children: PropTypes.element,
};

export default function Label({
	className,
	variant = 'box',
	error,
	noError,
	children,
	...remainingProps
}) {
	const { label } = remainingProps;
	const input = React.Children.only(children);
	const id = useMemo(getId, []);
	const errorId = `${id}-error`;
	const Frame = variant === 'underlined' ? Underline : Box;

	const [empty, setEmpty] = useState();
	const inputRef = useRef(null);
	const inputListener = useCallback(e => setEmpty(!e.target.value), [
		setEmpty,
	]);

	const setRef = useCallback(
		component => {
			const node = component?.input ?? component;

			inputRef.current?.removeEventListener?.('change', inputListener);
			inputRef.current = null;

			if (node && node instanceof HTMLInputElement) {
				inputRef.current = node;
				node.addEventListener('change', inputListener);
				setEmpty(!node.value);
			}
		},
		[inputListener, setEmpty]
	);

	const errorMessage = !noError && (
		<ErrorMessage error={error} id={errorId} role="alert" />
	);

	return (
		<Frame
			className={cx(styles.container, className)}
			empty={empty}
			errorCmp={errorMessage}
			error={!noError && error}
			data-input-id={id}
			{...remainingProps}
		>
			{React.cloneElement(input, {
				id,
				placeholder: input.props.placeholder || ' ',
				'aria-describedby': errorId,
				ref: setRef,
			})}
			{label && (
				<Text.Base as="label" data-placeholder htmlFor={id}>
					{label}
				</Text.Base>
			)}
		</Frame>
	);
}
