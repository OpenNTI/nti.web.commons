import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {getStyles, updateRef} from '../utils';
import {ScreenSize} from '../../decorators';

const styles = css`
	.limit-lines {
		display: inline-block;
		overflow: hidden;
	}
`;

function getLinesInfo (limitLines, forceLines) {

	if (limitLines != null) {
		return {
			lines: limitLines,
			style: 'maxHeight'
		};
	}

	if (forceLines != null) {
		return {
			lines: forceLines,
			style: 'height'
		};
	}
}

//TODO: recompute ellipse after a resize or size change

const LimitLines = React.forwardRef(({children, style:propStyle, className, limitLines, forceLines, screenWidth, screenHeight, ...otherProps}, ref) => {
	const single = limitLines != null ? limitLines === 1 : forceLines === 1;
	const textNode = useRef();
	const [{style:stateStyle, settled}, setState] = useState({style: {}, settled: false});

	const processRef = useCallback((node) => {
		textNode.current = node;

		//NOTE: We are waiting to call the textRef back until after we've set and rendered the maxHeight,
		//but we don't need to wait when we are unmounting.
		updateRef(ref, node);
	}, [ref]);

	useEffect(() => {
		const {current: node} = textNode;
		if (!node) { return; }

		const {lines, style} = getLinesInfo(limitLines, forceLines);
		const {lineHeight, paddingTop, paddingBottom} = getStyles(node, ['lineHeight', 'paddingTop', 'paddingBottom']);

		const max = Math.ceil(lineHeight * lines) + (paddingTop || 0) + (paddingBottom + 0);

		setState({
			style: {
				[style]: `${max}px`
			},
			settled: true
		});
	}, [limitLines, forceLines, textNode.current, screenWidth]);

	useEffect(() => {
		updateRef(ref, textNode.current);
	}, [textNode.current, stateStyle, settled]);

	const Text = React.Children.only(children);

	return React.cloneElement(
		Text,
		{
			...otherProps,
			className: cx(className, styles.limitLines, {single, settled}),
			style: {...(propStyle || {}), ...(stateStyle || {})},
			ref: processRef
		}
	);
});

LimitLines.displayName = 'LimitLines';
LimitLines.shouldApply = ({limitLines, forceLines}) => limitLines != null || forceLines != null;

LimitLines.propTypes = {
	className: PropTypes.string,
	limitLines: PropTypes.number,
	forceLines: PropTypes.number,
	style: PropTypes.object,
	children: PropTypes.any,

	//from ScreenSize decorator
	screenWidth: PropTypes.any,
	screenHeight: PropTypes.any,
};

export default ScreenSize()(LimitLines);
