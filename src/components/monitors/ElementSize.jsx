import React from 'react';
import PropTypes from 'prop-types';

function useResizeObserver (onChange) {
	const changeRef = React.useRef(null);
	const observerRef = React.useRef(null);

	if (changeRef.current === onChange) {
		return observerRef.current;
	}

	observerRef.current?.disconnect();

	changeRef.current = onChange;
	observerRef.current = new ResizeObserver((entries) => {
		for (let entry of entries) {
			onChange(entry.contentRect);
		}
	});

	return observerRef.current;
}

ElementSizeMonitorResize.propTypes = {
	as: PropTypes.any,
	onChange: PropTypes.func
};
function ElementSizeMonitorResize ({as:tag, onChange = () => {}, ...otherProps}) {
	const Cmp = tag || 'div';

	const observer = useResizeObserver(onChange);
	const elementRef = React.useRef();

	React.useEffect(() => {
		const target = elementRef.current;

		observer.observe(target);
		onChange(target?.getBoundingClientRect?.());

		return () => {
			observer.unobserve(target);
		};
	}, [observer]);

	return (
		<Cmp ref={elementRef} {...otherProps} />
	);
}

ElementSizeMonitorFallback.propTypes = {
	as: PropTypes.any,
	onChange: PropTypes.func
};
function ElementSizeMonitorFallback ({as: tag, onChange, ...otherProps}) {
	const Cmp = tag || 'div';

	const sizeRef = React.useRef();

	const attachCmp = (cmp) => {
		if (cmp) {
			const rect = cmp.getBoundingClientRect();

			if (!sizeRef.current || sizeRef.current.width !== rect.width || sizeRef.current.height !== rect.height) {
				onChange?.(rect);
			}

			sizeRef.current = rect;
		}
	};

	return (
		<Cmp ref={attachCmp} {...otherProps} />
	);
}


function ElementSizeMonitor (props, ref) {
	return typeof ResizeObserver !== 'undefined' ?
		(<ElementSizeMonitorResize {...props} ref={ref} />) :
		(<ElementSizeMonitorFallback {...props} ref={ref} />);
}

export default React.forwardRef(ElementSizeMonitor);