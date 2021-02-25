import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './Grid.css';

// append 'px' if it's a number otherwise leave it alone
const numpx = num => typeof num === 'number' ? `${num}px` : num;

// Renders a grid container that fills with as many columns as will fit, centered
export default function Grid ({as: Cmp = 'div', colsize, gap, className, singleColumn, ...other}) {
	const cssProperties = {
		'--colsize': numpx(colsize),
		'--gap': numpx(gap),
	};
	return (
		<Cmp
			style={cssProperties}
			className={cx(styles.container, {[styles.singleColumn]: singleColumn}, className)}
			{...other}
		/>
	);
}

// sets 'grid-column: 1 / -1' to occupy a full row
Grid.Header = ({as: Cmp = 'div', className, ...props}) => (
	<Cmp className={cx(styles.header, className)} {...props} />
);

Grid.propTypes = {
	as: PropTypes.node,
	colsize: PropTypes.oneOfType([
		PropTypes.number, // e.g. 200
		PropTypes.string // e.g. 'minmax(200, 1fr)'
	]),
	gap: PropTypes.number,
	singleColumn: PropTypes.bool // provides a "block" element while retaining the grid's width-snapping characteristics
};
