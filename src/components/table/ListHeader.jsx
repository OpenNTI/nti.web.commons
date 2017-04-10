import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {ASCENDING, DESCENDING} from './Constants';
import ListHeaderItem from './ListHeaderItem';

export default class ListHeader extends React.Component {
	static propTypes = {
		className: React.PropTypes.string,
		columns: React.PropTypes.arrayOf(React.PropTypes.shape({
			name: React.PropTypes.string.isRequired,
			classes: React.PropTypes.shape({
				name: React.PropTypes.string,
				default: React.PropTypes.string,
				inactive: React.PropTypes.string,
				active: React.PropTypes.string,
				asc: React.PropTypes.string,
				desc: React.PropTypes.string
			}),
			display: React.PropTypes.string,
			sortFn: React.PropTypes.func.isRequired
		})),
		activeSort: React.PropTypes.string,
		activeDirection: React.PropTypes.string,
		onSortChange: React.PropTypes.func
	}


	render () {
		const {columns, className} = this.props;
		const cls = cx('list-table-header', className);

		return (
			<div className={cls}>
				{columns.map(this.renderCell)}
			</div>
		);
	}


	renderCell = (column, index) => {
		const {activeSort, activeDirection, onSortChange} = this.props;

		return (
			<ListHeaderItem key={index} column={column} active={activeSort === column.name} direction={activeDirection} onSort={onSortChange} />
		);
	}
}
