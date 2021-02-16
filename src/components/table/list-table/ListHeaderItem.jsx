import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { ASCENDING, DESCENDING } from './Constants';

export default class ListHeaderCell extends React.Component {
	static propTypes = {
		column: PropTypes.shape({
			name: PropTypes.string.isRequired,
			classes: PropTypes.shape({
				name: PropTypes.string,
				inactive: PropTypes.string,
				active: PropTypes.string,
				asc: PropTypes.string,
				desc: PropTypes.string,
			}),
			display: PropTypes.string,
			sortFn: PropTypes.func.isRequired,
		}),
		active: PropTypes.bool,
		direction: PropTypes.string,
		onSort: PropTypes.func,
	};

	onClick = () => {
		const { column, direction, onSort } = this.props;

		const newDirection = direction === ASCENDING ? DESCENDING : ASCENDING;
		const directionMod = direction === ASCENDING ? -1 : 1;

		const sortFn = (a, b) => {
			const sort = column.sortFn(a, b);

			return sort * directionMod;
		};

		if (onSort) {
			onSort(sortFn, column.name, newDirection);
		}
	};

	render() {
		const { column, active, direction } = this.props;
		const cls = cx('list-header-column', column.classes.name, {
			[`${column.classes.inactive}`]: !active,
			[`${column.classes.active}`]: active,
			[`${column.classes.asc}`]: active && direction === ASCENDING,
			[`${column.classes.desc}`]: active && direction === DESCENDING,
		});

		return (
			<div className={cls} onClick={this.onClick} role="columnheader">
				<span>{column.display || column.name}</span>
			</div>
		);
	}
}
