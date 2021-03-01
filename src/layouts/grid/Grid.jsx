import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { useContainerWidth } from '../../hooks';

const Grid = styled('div')`
	display: grid;
	grid-template-columns:
		[full-start] repeat(auto-fill, var(--col-width, 100%))
		[full-end];
	grid-auto-rows: min-content;
	gap: var(--gap, 14px);
	margin: 0;
	justify-content: center;
	list-style: none;
	padding: 0;

	/* headers and directly nested containers occupy the full available width */
	& > &,
	&.header,
	&.variant-single-column > * {
		grid-column: 1 / -1;
	}

	& > * {
		overflow: hidden;
	}
`;

// append 'px' if it's a number otherwise leave it alone
const pixels = num => (typeof num === 'number' ? `${num}px` : num);

// Renders a grid container that fills with as many columns as will fit, centered
export default function GridLogic({
	children,
	colWidth: width,
	gap,
	singleColumn,
	...other
}) {
	const ref = useRef();
	const { current: el } = ref;
	const containerWidth = useContainerWidth(ref);

	const childRenderer = typeof children === 'function';
	const cssProperties = {
		'--col-width': pixels(width),
		'--gap': pixels(gap),
	};

	const columnWidth =
		width ||
		(!el
			? 0
			: parseInt(
					// should be reading from a cached style computation
					getComputedStyle(el).getPropertyValue('--col-width'),
					10
			  ));

	const columns = singleColumn
		? 1
		: Math.max(1, Math.floor(containerWidth / columnWidth) || 1);

	return (
		<Grid
			ref={ref}
			style={cssProperties}
			variant={singleColumn ? 'single-column' : null}
			{...other}
		>
			{childRenderer ? children(columns) : children}
		</Grid>
	);
}

// sets 'grid-column: 1 / -1' to occupy a full row
GridLogic.Header = props => <GridLogic header {...props} />;

GridLogic.propTypes = {
	as: PropTypes.any,
	colWidth: PropTypes.oneOfType([
		PropTypes.number, // e.g. 200
		PropTypes.string, // e.g. 'minmax(200, 1fr)'
	]),
	gap: PropTypes.number,
	singleColumn: PropTypes.bool, // provides a "block" element while retaining the grid's width-snapping characteristics
};
