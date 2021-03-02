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
`;

//#region macros

// append 'px' if it's a number otherwise leave it alone
const pixels = num => (typeof num === 'number' ? `${num}px` : num);

const resolveValue = ({ current: el }, containerWidth) => ([
	givenValue,
	property,
]) => {
	const valueSpec = pixels(
		givenValue ||
			(!el ? 0 : getComputedStyle(el).getPropertyValue(property))
	);
	//A spec is the css value of the column width: 200px, 100%, minmax(200, 1ft), etc.
	const [, valueStr, unit] = valueSpec.split(/([\d.]+)/);
	//if the unit is %, "" or px we're okay...
	const value = parseFloat(valueStr, 10);

	// but if its anything else, our calculation will be wrong.

	return unit === '%' ? containerWidth * (100 / value) : value;
};

const computeColumns = (containerWidth, columnWidth, columnGap) =>
	Math.max(
		1,
		Math.floor((containerWidth + columnGap) / columnWidth + columnGap) || 1
	);
//#endregion

// Renders a grid container that fills with as many columns as will fit, centered
export default function GridLogic({
	children,
	colWidth: width,
	gap,
	singleColumn,
	style,
	...other
}) {
	const ref = useRef();
	const containerWidth = useContainerWidth(ref);

	const childRenderer = typeof children === 'function';
	const cssProperties = {
		...style,
		'--col-width': pixels(width),
		'--gap': pixels(gap),
	};

	if (
		childRenderer &&
		!singleColumn &&
		!/^\d+/.test(cssProperties['--col-width'])
	) {
		// eslint-disable-next-line no-console
		console.warn(
			'The number of columns cannot be computed with the width of %o. Please use regular children nodes instead of a render function.',
			width
		);
	}

	const columns =
		singleColumn || !childRenderer
			? 1
			: // Only compute the column count if we have a render
			  // function child, and we are not in single-column mode.
			  computeColumns(
					containerWidth,
					...[
						[width, '--col-width'],
						[gap, '--gap'],
					].map(resolveValue(ref, containerWidth))
			  );

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
	style: PropTypes.object,
};
