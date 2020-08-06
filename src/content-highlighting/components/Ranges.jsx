import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Ranges.css';

const cx = classnames.bind(Styles);

function getStylesForRect (rect, parentRect, rangesRect) {
	const top = rect.top - parentRect.top;
	const topGap = (rangesRect?.top - parentRect.bottom) || 0;
	const leftGap = (rangesRect?.left - parentRect.left) || 0;

	return {
		width: `${rect.width}px`,
		height: `${rect.height}px`,
		left: `${rect.left - parentRect.left - leftGap}px`,
		top: `${top - parentRect.height - topGap}px`
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
export default function Ranges ({ranges, containerRef: parentRef}) {
	const [rootEl, setRootEl] = React.useState();
	const getRekt = React.useCallback(el => (rootEl !== el) && setRootEl(el), [rootEl, setRootEl]);

	const rects = ranges?.reduce?.((acc, range) => ([...acc, ...Array.from(range.getClientRects())]), []);
	const parentRect = parentRef?.current?.getBoundingClientRect();
	const rangesRect = rootEl?.getBoundingClientRect();

	return (!parentRef?.current || !ranges?.length) ? null : (
		<div className={cx('ranges')} ref={getRekt}>
			{(rects ?? []).map((rect, key) => (
				<span
					key={key}
					style={getStylesForRect(rect, parentRect, rangesRect)}
					className={cx('highlight')}
				/>
			))}
		</div>
	);
}
