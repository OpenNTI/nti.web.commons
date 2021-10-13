import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { useResizeObserver } from '../../hooks/use-resize-observer';

ElementSizeMonitorResize.propTypes = {
	as: PropTypes.any,
	onChange: PropTypes.func,
};
function ElementSizeMonitorResize({
	as: tag,
	onChange = () => {},
	...otherProps
}) {
	const Cmp = tag || 'div';

	const observer = useResizeObserver(onChange);
	const elementRef = useRef();

	useEffect(() => {
		const target = elementRef.current;

		observer.observe(target);
		onChange(target?.getBoundingClientRect?.());

		return () => {
			observer.unobserve(target);
		};
	}, [observer]);

	return <Cmp ref={elementRef} {...otherProps} />;
}

ElementSizeMonitorFallback.propTypes = {
	as: PropTypes.any,
	onChange: PropTypes.func,
};
function ElementSizeMonitorFallback({ as: tag, onChange, ...otherProps }) {
	const Cmp = tag || 'div';

	const sizeRef = useRef();

	const attachCmp = cmp => {
		if (cmp) {
			const rect = cmp.getBoundingClientRect();

			if (
				!sizeRef.current ||
				sizeRef.current.width !== rect.width ||
				sizeRef.current.height !== rect.height
			) {
				onChange?.(rect);
			}

			sizeRef.current = rect;
		}
	};

	return <Cmp ref={attachCmp} {...otherProps} />;
}

function ElementSizeMonitor(props, ref) {
	return typeof ResizeObserver !== 'undefined' ? (
		<ElementSizeMonitorResize {...props} ref={ref} />
	) : (
		<ElementSizeMonitorFallback {...props} ref={ref} />
	);
}

export default React.forwardRef(ElementSizeMonitor);
