import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {ASCENDING, DESCENDING} from './Constants';
import ListHeaderItem from './ListHeaderItem';

export default class ListHeader extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		columns: PropTypes.arrayOf(PropTypes.shape({
			name: PropTypes.string.isRequired,
			classes: PropTypes.shape({
				name: PropTypes.string,
				default: PropTypes.string,
				inactive: PropTypes.string,
				active: PropTypes.string,
				asc: PropTypes.string,
				desc: PropTypes.string
			}),
			display: PropTypes.string,
			sortFn: PropTypes.func.isRequired
		})),
		activeSort: PropTypes.string,
		activeDirection: PropTypes.string,
		onSortChange: PropTypes.func
	}


	render () {
		const {columns, className} = this.props;
		const cls = cx('list-table-header', className);

		return (
			<div className={cls} role="row">
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
