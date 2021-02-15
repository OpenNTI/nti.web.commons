import React, {useCallback, useRef, useReducer} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { OnScreen } from '../components/monitors';
import { DataURIs } from '../constants';

const { BLANK_IMAGE } = DataURIs;

const DELAY = 250;

const styles = css`
	.img.loading {
		animation: shimmer 2s infinite;
		background: linear-gradient(to right, #eff1f3 4%, #e2e2e2 25%, #eff1f3 36%);
		background-size: 1000px 100%;
		background-attachment: fixed;
	}

	.img:not(.loading) {
		animation: fadeup 0.5s;
		animation-iteration-count: 1;
		animation-fill-mode: both;
	}

	@keyframes shimmer {
		0% { background-position: -1000px 0; }
		100% { background-position: 1000px 0; }
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
	const [{source, loaded}, dispatch] = useReducer((state, action) => ({
		...state,
		...action
	}), {source: BLANK_IMAGE, loaded: false});

	const onPreload = useCallback(() => {
		dispatch({ loaded: true, source: src });
	});

	const preloader = useRef();
	const preloaderTimeoutId = useRef();

	const onChange = useCallback((onScreen) => {
		// if not on screen anymore kill the preload timeout
		if (!onScreen) {
			clearTimeout(preloaderTimeoutId.current);
			preloaderTimeoutId.current = null;
		}

		// if onscreen setTimeout for preloading
		if (onScreen && (src !== source) && !preloaderTimeoutId.current) {
			// defer loading so we're not kicking off requests for images that are
			// rapidly scrolling by; quickly coming into view and going back out again.
			preloaderTimeoutId.current = setTimeout(() => {
				if (preloader.current) {
					preloader.current.removeEventListener('load', onPreload);
				}
				preloader.current = new Image();
				preloader.current.addEventListener('load', onPreload);
				preloader.current.src = src;
				preloaderTimeoutId.current = null;
			}, DELAY);
		}
	}, [src]);

	return (
		<OnScreen
			onChange={onChange}
			as="img"
			src={source}
			className={cx(styles.img, {[styles.loading]: !loaded}, className)}
			{...props}
		/>
	);
}

DeferredImage.propTypes = {
	src: PropTypes.string.isRequired
};
