import React from 'react';
import cx from 'classnames';

import ListHeaderItem from './ListHeaderItem';

export default class ListHeader extends React.Component {
	static propTypes = {
		className: React.PropTypes.string,
		cells: React.PropTypes.arrayOf(React.PropTypes.shape({
			name: React.PropTypes.string.isRequired,
			className: React.PropTypes.string,
			display: React.PropTypes.string,
			sortFn: React.PropTypes.func.isRequired
		})),
		activeSort: React.PropTypes.string,
		activeDirection: React.PropTypes.string,
		onSortChagne: React.PropTypes.func
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
