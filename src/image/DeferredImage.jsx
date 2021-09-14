import React, { useCallback, useEffect, useRef, useReducer } from 'react';
import cx from 'classnames';

import { OnScreen } from '../components/monitors';
import { DataURIs } from '../constants';

const { BLANK_IMAGE } = DataURIs;

const DELAY = 250;

const styles = stylesheet`
	.img.loading {
		animation: shimmer 2s infinite;
		background: linear-gradient(
			105deg,
			var(--panel-background-alt, #e2e2e2) 40%,
			white 50%,
			var(--panel-background-alt, #e2e2e2) 60%
		);
		background-size: 1000px 100%;
		background-attachment: fixed;
	}

	.img:not(.loading) {
		animation: fadeup 0.5s;
		animation-iteration-count: 1;
		animation-fill-mode: both;
	}

	@keyframes shimmer {
		0% {
			background-position: -1000px 0;
		}

		100% {
			background-position: 1000px 0;
		}
	}

	@keyframes fadeup {
		0% {
			opacity: 0;
			transform: scale(0.875);
		}

		30% {
			transform: scale(1);
		}

		100% {
			opacity: 1;
		}
	}
`;

export default React.forwardRef(
	/**
	 * @param {React.PropsWithRef<HTMLImageElement>} root0
	 * @param {string} root0.src
	 * @param {string=} root0.className
	 * @param {(e: Error) => void} root0.onError
	 * @param {React.Ref<HTMLImageElement>} ref
	 * @returns {JSX.Element}
	 */
	function DeferredImage({ src, className, onError, ...props }, ref) {
		const deps = [src, onError];
		const [{ source, loaded, onScreen }, dispatch] = useReducer(
			(state, action) => ({
				...state,
				...action,
			}),
			{ source: BLANK_IMAGE, loaded: false, isOnScreen: false }
		);

		const { current: internal } = useRef({ image: null });

		useEffect(() => {
			// abort any pending preload timeout
			clearTimeout(internal.timeout);
			const onLoad = () => dispatch({ loaded: true, source: src });
			const _onError = (...args) => void onError?.(...args);

			const image = new Image();
			image.addEventListener('load', onLoad);
			image.addEventListener('error', _onError);

			internal.invalidate?.();
			internal.invalidate = () => {
				image.removeEventListener('load', onLoad);
				image.removeEventListener('error', onError);
			};

			// if we're already on screen when src changes, kick off the load
			if (onScreen) {
				// setTimeout to defer loading so we're not kicking off requests for images that
				// are rapidly scrolling by; quickly coming into view and going back out again.
				internal.timeout = setTimeout(() => {
					delete internal.timeout;
					internal.image = image;
					internal.image.src = src;
				}, DELAY);
			}

			return internal.invalidate;
		}, [...deps, onScreen]);

		const onChange = useCallback(x => dispatch({ onScreen: x }), [...deps]);

		return (
			<OnScreen
				onChange={onChange}
				as="img"
				src={source}
				ref={ref}
				className={cx(
					styles.img,
					{ [styles.loading]: !loaded },
					className
				)}
				{...props}
			/>
		);
	}
);
