import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Ranges.css';

const cx = classnames.bind(Styles);

function getStylesForRect (rect, containerRect) {
	const top = rect.top - containerRect.top;

	return {
		width: `${rect.width}px`,
		height: `${rect.height}px`,
		left: `${rect.left - containerRect.left}px`,
		top: `${top - containerRect.height - rect.height}px`
	};
}

Ranges.propTypes = {
	ranges: PropTypes.array,
	containerRef: PropTypes.shape({
		current: PropTypes.shape({
			getBoundingClientRect: PropTypes.func
		})
	})
};
export default function Ranges ({ranges, containerRef}) {
	if (!containerRef?.current || !ranges?.length) { return null; }

	const rects = ranges.reduce((acc, range) => ([...acc, ...Array.from(range.getClientRects())]), []);
	const containerRect = containerRef.current.getBoundingClientRect();

	return (
		<div className={cx('ranges')}>
			{(rects ?? []).map((rect, key) => (
				<span
					key={key}
					style={getStylesForRect(rect, containerRect)}
					className={cx('highlight')}
				/>
			))}
		</div>
	);
}