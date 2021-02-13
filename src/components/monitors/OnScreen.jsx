import React from 'react';
import PropTypes from 'prop-types';

const Cache = new WeakMap();

const rootMarginFromBuffer = (buffer = 0) => {
	if (typeof buffer === 'number') { return `${buffer}px ${buffer}px ${buffer}px ${buffer}px`; }

	//fill this in
};

function useIntersectionObserver (onChange, buffer) {
	const changeRef = React.useRef(null);
	const bufferRef = React.useRef(null);

	const observerRef = React.useRef(null);

	if (changeRef.current === onChange && bufferRef.current === buffer) {
		return observerRef.current;
	}

	observerRef.current?.disconnect();

	changeRef.current = onChange;
	bufferRef.current = buffer;

	observerRef.current = new IntersectionObserver(
		(entries) => {
			const entry = entries[0];//should only ever be one;
			const onScreen = entry.isIntersecting;

			const prev = Cache.get(entry.target);

			Cache.set(entry.target, onScreen);

			if (prev == null || prev !== onScreen) {
				onChange(onScreen);
			}

		}, {
			rootMargin: rootMarginFromBuffer(buffer)
		}
	);

	return observerRef.current;
}


OnScreenMonitor.propTypes = {
	as: PropTypes.any,

	buffer: PropTypes.number,
	onChange: PropTypes.func
};
function OnScreenMonitor ({onChange, as:tag, buffer, ...otherProps}, fwdRef) {
	const Cmp = tag || 'div';

	const observer = useIntersectionObserver(onChange, buffer);
	const elementRef = fwdRef || React.useRef();

	React.useEffect(() => {
		const target = elementRef.current;

		observer.observe(target);

		return () => observer.unobserve(target);
	}, [observer]);

	return (
		<Cmp ref={elementRef} {...otherProps} />
	);
}

export default React.forwardRef(OnScreenMonitor);
