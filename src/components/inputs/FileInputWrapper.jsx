// @ts-check
import React, { useCallback, useRef } from 'react';
import cx from 'classnames';

import { DropZone as DZ } from '../../drag-and-drop/';

/** @type {import('@nti/web-core/src/styles')} */

/** @typedef {import('@nti/web-core/src/types').IntrinsicProps} IntrinsicProps */

const DropZone = styled(DZ)`
	display: inline-block;
	position: relative;
	cursor: pointer;
`;

const File = styled('input').attrs({ type: 'file', tabIndex: -1 })`
	position: absolute;
	inset: 0;
	font-size: 2rem;
	padding: 0;
	margin: 0;
	opacity: 0;
	border: 0;
	width: 100%;
	height: 100%;
	cursor: pointer;
`;

const clickThrough = css`
	pointer-events: none;
`;

/** @typedef {(files: File[], e: Event) => void} FileChangeHandler */

/**
 * @param {{onChange: FileChangeHandler} & IntrinsicProps} props
 * @returns {JSX.Element}
 */
export default function FileInputWrapper({
	className,
	children,
	onChange,
	style,
	...otherProps
}) {
	const ref = useRef(null);
	const fileChanged = useCallback(
		(files, e) => {
			onChange?.(files, e);
		},
		[onChange]
	);

	const handleChange = useCallback(
		e => {
			e.preventDefault?.();
			fileChanged(e.target?.files, e);
		},
		[fileChanged]
	);

	const onDrop = useCallback(
		e => {
			fileChanged(e.dataTransfer?.files, e);
		},
		[fileChanged]
	);

	let clickableChild = false;
	const child = React.Children.toArray(children).map(c =>
		!React.isValidElement(c)
			? c
			: ((clickableChild = true),
			  React.cloneElement(c, {
					onClick: () => ref.current?.click(),
			  }))
	);

	return (
		<DropZone
			className={cx('nti-file-input-wrapper', className)}
			style={style}
			onDrop={onDrop}
		>
			{child}
			<File
				{...otherProps}
				className={cx({ [clickThrough]: clickableChild })}
				onChange={handleChange}
				ref={ref}
			/>
		</DropZone>
	);
}
