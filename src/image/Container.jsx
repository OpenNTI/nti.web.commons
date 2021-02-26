import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Styles from './Container.css';
import { getStylesForAspectRatio } from './utils';

ImageContainer.propTypes = {
	as: PropTypes.any,
	className: PropTypes.string,
	aspectRatio: PropTypes.number,
	style: PropTypes.object,
};
export default function ImageContainer({
	as:tag,
	aspectRatio,
	className,
	style,
	...otherProps
}) {
	const Cmp = tag || 'div';
	const aspectStyle = aspectRatio
		? { paddingBottom: getStylesForAspectRatio(aspectRatio).paddingBottom }
		: {};

	return (
		<Cmp
			className={cx(Styles.imageContainer, className)}
			style={{ ...(style || {}), ...aspectStyle }}
			{...otherProps}
		/>
	);
}
