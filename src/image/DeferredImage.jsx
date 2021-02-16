import React, {useCallback, useEffect, useRef, useReducer} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { OnScreen } from '../components/monitors';
import { DataURIs } from '../constants';

const { BLANK_IMAGE } = DataURIs;

const DELAY = 250;

const styles = css`
	.img.loading {
		animation: shimmer 2s infinite;
		background:
			linear-gradient(
				to right,
				#eff1f3 4%,
				#e2e2e2 25%,
				#eff1f3 36%
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

export default function DeferredImage ({src, className, ...props}) {
	const [{source, loaded, isOnScreen}, dispatch] = useReducer((state, action) => ({
		...state,
		...action
	}), { source: BLANK_IMAGE, loaded: false, isOnScreen: false });

	const onPreload = useCallback(() => {
		dispatch({ loaded: true, source: src });
	}, [src]);

	const preloader = useRef({ image: null });

	const onError = useCallback((...args) => void props.onError?.(...args), [props.onError]);

	const preload = useCallback(() => {
		// abort any pending preload timeout
		clearTimeout(preloader.current.timeout);

		// setTimeout to defer loading so we're not kicking off requests for images that
		// are rapidly scrolling by; quickly coming into view and going back out again.
		preloader.current.timeout = setTimeout(() => {
			preloader.current.image?.removeEventListener?.('load', onPreload);
			preloader.current.image?.removeEventListener?.('error', onError);
			preloader.current.image = new Image();
			preloader.current.image.addEventListener('load', onPreload);
			preloader.current.image.addEventListener('error', onError);
			preloader.current.image.src = src;
			delete preloader.current.timeout;
		}, DELAY);
	}, [src]);

	// if we're already on screen when src changes, kick off the preload
	useEffect(() => {
		if (isOnScreen && source !== src && preloader.current.image?.src !== src) {
			preload();
		}
	}, [src, source, preload]);

	const onChange = useCallback((onScreen) => {
		dispatch({ isOnScreen: onScreen });

		// if not on screen anymore kill the preload timeout
		if (!onScreen) {
			clearTimeout(preloader.current.timeout);
			delete preloader.current.timeout;
		}

		// if onscreen setTimeout for preloading
		if (onScreen && (src !== source) && !preloader.current.timeout) {
			preload();
		}
	}, [src, props.onError]);

	return (
		<OnScreen
			onChange={onChange}
			as="img"
			src={source}
			className={cx(styles.img, { [styles.loading]: !loaded }, className)}
			{...props}
		/>
	);
}

DeferredImage.propTypes = {
	src: PropTypes.string,
	onError: PropTypes.func
};
