import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import ListHeaderItem from './ListHeaderItem';

export default class ListHeader extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		cells: PropTypes.arrayOf(PropTypes.shape({
			name: PropTypes.string.isRequired,
			className: PropTypes.string,
			display: PropTypes.string,
			sortFn: PropTypes.func.isRequired
		})),
		activeSort: PropTypes.string,
		activeDirection: PropTypes.string,
		onSortChagne: PropTypes.func
	}


	render () {
		const {cells, className} = this.props;
		const cls = cx('list-table-header', className);

		return (
			<div className={cls}>
				{cells.map(this.renderCell)}
			</div>
		);
	}


	renderCell = (cell, index) => {
		const {activeSort, activeDirection} = this.props;

		return (
			<ListHeaderItem key={index} cell={cell} active={activeSort === cell.name} direction={activeDirection} />
		);
	}
}
