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

ElementSizeMonitor.propTypes = {
	as: PropTypes.any,
	onChange: PropTypes.func
};
export default function ElementSizeMonitor ({as:tag, onChange = () => {}, ...otherProps}) {
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