import React, { useCallback, useEffect, useRef } from 'react';

const Cache = new WeakMap();

const rootMarginFromBuffer = (buffer = 0) => {
	if (typeof buffer === 'number') {
		return `${buffer}px ${buffer}px ${buffer}px ${buffer}px`;
	}

	//fill this in
};

const hasIntersectionObserver = () =>
	typeof global.IntersectionObserver !== 'undefined';

const getIntersectionObserver = (onChange, buffer) =>
	new IntersectionObserver(
		entries => {
			const entry = entries[0]; //should only ever be one;
			const onScreen = entry.isIntersecting;

			const prev = Cache.get(entry.target);

			Cache.set(entry.target, onScreen);

			if (prev == null || prev !== onScreen) {
				onChange(onScreen);
			}
		},
		{
			rootMargin: rootMarginFromBuffer(buffer),
		}
	);

const getFallbackObserver = onChange => ({
	observe: () => onChange(true),
	unobserve: () => {},
	disconnect: () => {},
});

function useIntersectionObserver(onChange, buffer) {
	const changeRef = useRef(null);
	const bufferRef = useRef(null);

	const observerRef = useRef(null);

	if (changeRef.current === onChange && bufferRef.current === buffer) {
		return observerRef.current;
	}

	observerRef.current?.disconnect();

	changeRef.current = onChange;
	bufferRef.current = buffer;

	observerRef.current = hasIntersectionObserver()
		? getIntersectionObserver(onChange, buffer)
		: getFallbackObserver(onChange, buffer);

	return observerRef.current;
}

export default React.forwardRef(
	/**
	 * @template T
	 * @param {object} props
	 * @param {() => void} props.onChange
	 * @param {string|React.ComponentType<T>} [props.as='div']
	 * @param {number} [props.buffer=0]
	 * @param {React.Ref<T>} ref
	 * @returns {JSX.Element}
	 */
	function OnScreenMonitor(
		{ onChange, as: tag, buffer, ...otherProps },
		ref
	) {
		const Cmp = tag || 'div';

		const observer = useIntersectionObserver(onChange, buffer);
		const elementRef = useRef();

		useEffect(() => {
			const target = elementRef.current;

			observer.observe(target);

			return () => observer.unobserve(target);
		}, [observer]);

		const setRef = useCallback(
			r => {
				elementRef.current = r;
				if (ref) {
					if (typeof ref === 'function') ref(r);
					else ref.current = r;
				}
			},
			[ref]
		);

		return <Cmp ref={setRef} {...otherProps} />;
	}
);
