import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Container.css';
import { getStylesForAspectRatio } from './utils';

const cx = classnames.bind(Styles);

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
			className={cx('image-container', className)}
			style={{ ...(style || {}), ...aspectStyle }}
			{...otherProps}
		/>
	);
}
