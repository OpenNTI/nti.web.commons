import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {ASCENDING, DESCENDING} from './Constants';


export default class ListHeaderCell extends React.Component {
	static propTypes = {
		column: React.PropTypes.shape({
			name: React.PropTypes.string.isRequired,
			classes: React.PropTypes.shape({
				name: React.PropTypes.string,
				inactive: React.PropTypes.string,
				active: React.PropTypes.string,
				asc: React.PropTypes.string,
				desc: React.PropTypes.string
			}),
			display: React.PropTypes.string,
			sortFn: React.PropTypes.func.isRequired
		}),
		active: React.PropTypes.bool,
		direction: React.PropTypes.string,
		onSort: React.PropTypes.func
	}

	onClick = () => {
		const {column, direction, onSort} = this.props;


		const newDirection = direction === ASCENDING ? DESCENDING : ASCENDING;
		const directionMod = direction === ASCENDING ? -1 : 1;

		const sortFn = (a, b) => {
			const sort = column.sortFn(a, b);

			return sort * directionMod;
		};

		if (onSort) {
			onSort(sortFn, column.name, newDirection);
		}
	}


	render () {
		const {column, active, direction} = this.props;
		const cls = cx('list-header-column', column.classes.name, {
			[`${column.classes.inactive}`]: !active,
			[`${column.classes.active}`]: active,
			[`${column.classes.asc}`]: active && direction === ASCENDING,
			[`${column.classes.desc}`]: active && direction === DESCENDING
		});

		return (
			<div className={cls} onClick={this.onClick}>
				<span>{column.display || column.name}</span>
			</div>
		);
	}
}
