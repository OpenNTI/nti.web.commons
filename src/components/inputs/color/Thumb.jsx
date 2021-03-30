import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const Thumb = styled.div`
	width: 14px;
	height: 14px;
	border-radius: 14px;
	border: 2px solid white;
	box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.63);
`;

ColorInputThumb.propTypes = {
	className: PropTypes.string,
	value: PropTypes.shape({
		hex: PropTypes.shape({
			toString: PropTypes.func,
		}),
	}),
	style: PropTypes.object,
};
export default function ColorInputThumb({
	className,
	value,
	style,
	...otherProps
}) {
	return (
		<Thumb
			className={cx(
				'nti-color-input-thumb',
				'color-input-thumb',
				className
			)}
			style={{
				...style,
				...(value ? { background: value.hex.toString() } : {}),
			}}
			{...otherProps}
		/>
	);
}
