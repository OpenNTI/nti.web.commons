import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { updateRef } from '../utils';

const styles = stylesheet`
	.limit-lines {
		display: -webkit-box !important;
		-webkit-line-clamp: var(--line-limit);
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
		max-height: calc(var(--line-limit) * var(--line-height));

		/* The eventual standard:
		https://drafts.csswg.org/css-overflow-3/#propdef-line-clamp */
		line-clamp: var(--line-limit) "…";
	}
`;

const LimitLines = React.forwardRef(
	({ children, style, className, limitLines: limit, ...otherProps }, ref) => {
		const local = useRef();
		const Text = React.Children.only(children);
		const [lineHeight, setLineHeight] = useState('1em');

		const handleRef = useCallback(x => {
			local.current = x;
			updateRef(ref, x);
		}, []);

		useEffect(() => {
			setLineHeight(getComputedStyle(local.current).lineHeight);
		}, [className]);

		return React.cloneElement(Text, {
			...otherProps,
			ref: handleRef,
			className: cx(className, styles.limitLines),
			style: {
				...style,
				'--line-limit': limit,
				'--line-height': lineHeight,
			},
		});
	}
);

LimitLines.displayName = 'LimitLines';
LimitLines.shouldApply = ({ limitLines }) => limitLines != null;

LimitLines.propTypes = {
	limitLines: PropTypes.number,
	style: PropTypes.object,
};

export default LimitLines;
