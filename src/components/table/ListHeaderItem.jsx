import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {ASCENDING, DESCENDING} from './Constants';


export default class ListHeaderCell extends React.Component {
	static propTypes = {
		cell: PropTypes.shape({
			name: PropTypes.string.isRequired,
			className: PropTypes.string,
			display: PropTypes.string,
			sortFn: PropTypes.func.isRequired
		}),
		active: PropTypes.bool,
		direction: PropTypes.string,
		onSort: PropTypes.func,
	}


	onClick = () => {
		const {cell, active, direction, onSort} = this.props;

		const newDirection = !active || direction === ASCENDING ? DESCENDING : ASCENDING;
		const directionMod = direction === ASCENDING ? -1 : 1;

		const sortFn = (a, b) => {
			const sort = cell.sortFn(a, b);

			return sort * directionMod;
		};

		if (onSort) {
			onSort(sortFn, cell.name, newDirection);
		}
	}


	render () {
		const {cell, active, direction} = this.props;
		const cls = cx('list-header-cell', cell.className, active ? direction : '', {active});

		return (
			<div className={cls} onClick={this.onClick}>
				<span>{cell.display || cell.name}</span>
			</div>
		);
	}
}
