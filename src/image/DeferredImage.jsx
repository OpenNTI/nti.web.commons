import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { OnScreen } from '../components/monitors';
import { DataURIs } from '../constants';

const { BLANK_IMAGE } = DataURIs;

const styles = css`
	.loading {
		animation: shimmer 2s infinite;
		background: linear-gradient(to right, #eff1f3 4%, #e2e2e2 25%, #eff1f3 36%);
		background-size: 1000px 100%;
	}
	@keyframes shimmer {
		0% { background-position: -1000px 0; }
		100% { background-position: 1000px 0; }
	}
`;

export default function DeferredImage ({src, className, ...props}) {
	const [source, setSource] = useState(BLANK_IMAGE);
	const [loaded, setLoaded] = useState(false);
	const onLoad = useCallback(() => {
		if (!loaded && src === source) {
			setLoaded(true);
		}
	}, [src, source]);

	const onChange = useCallback((onScreen) => {
		if (onScreen && (src !== source)) {
			setSource(src);
		}
	}, [src]);

	return (
		<OnScreen
			onChange={onChange}
			onLoad={onLoad}
			as="img"
			src={source}
			className={cx({[styles.loading]: !loaded}, className)}
			{...props}
		/>
	);
}

DeferredImage.propTypes = {
	src: PropTypes.string.isRequired
};
