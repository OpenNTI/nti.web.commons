import React from 'react';
import cx from 'classnames';

import {ASCENDING, DESCENDING} from './Constants';


export default class ListHeaderCell extends React.Component {
	static propTypes = {
		cell: React.PropTypes.shape({
			name: React.PropTypes.string.isRequired,
			className: React.PropTypes.string,
			display: React.PropTypes.string,
			sortFn: React.PropTypes.func.isRequired
		}),
		active: React.PropTypes.bool,
		direction: React.PropTypes.string,
		onSort: React.PropTypes.func,
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
