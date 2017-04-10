import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {DESCENDING} from './Constants';
import ListHeader from './ListHeader';


function applySortTo (items, sortFn) {
	return items.sort(sortFn);
}



export default class ListTable extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		headerClassName: PropTypes.string,
		bodyClassName: PropTypes.string,
		items: PropTypes.array,
		renderItem: PropTypes.func.isRequired,
		cells: PropTypes.arrayOf(PropTypes.shape({
			name: PropTypes.string.isRequired,
			className: PropTypes.string,
			display: PropTypes.string,
			sortFn: PropTypes.func.isRequired
		})),
		defaultSort: PropTypes.string
	}


	constructor (props) {
		super(props);

		const {items} = props;
		const activeSort = this.getDefaultSort(props);

		this.state = {
			items: applySortTo(items, activeSort.sortFn),
			activeSortFn: activeSort.sortFn,
			activeSort: activeSort.name,
			activeDirection: DESCENDING
		};
	}


	componentWillReceiveProps (nextProps) {
		const {items:nextItems} = nextProps;
		const {items:oldItems} = this.props;
		const {activeSortFn} = this.state;

		if (nextItems !== oldItems) {
			this.setState({
				items: applySortTo(nextItems, activeSortFn)
			});
		}
	}


	getDefaultSort (props = this.props) {
		const {cells, defaultSort} = props;

		if (!defaultSort) { return cells[0]; }

		for (let cell of cells) {
			if (cell.name === defaultSort) {
				return cell;
			}
		}

		throw new Error('Default Sort Not in Cells');
	}


	onSortChange = (sortFn, name, direction) => {
		const {items} = this.state;

		this.setState({
			items: applySortTo(items, sortFn),
			activeSortFn: sortFn,
			activeSort: name,
			activeDirection: direction
		});
	}


	render () {
		const {className} = this.props;
		const {activeSort, activeDirection} = this.state;
		const cls = cx('list-table', className, activeSort, activeDirection);

		return (
			<div className={cls}>
				{this.renderHeader()}
				{this.renderList()}
			</div>
		);
	}


	renderHeader () {
		const {cells, headerClassName} = this.props;
		const {activeSort, activeDirection} = this.state;

		return (
			<ListHeader className={headerClassName} cells={cells} activeSort={activeSort} activeDirection={activeDirection} onSortChange={this.onSortChange} />
		);
	}


	renderList () {
		const {renderItem, bodyClassName} = this.props;
		const {items} = this.state;
		const cls = cx('list-table-body', bodyClassName);

		return (
			<ul className={cls}>
				{items.map((x, index) => {
					return (<li key={index}>{renderItem(x, index)}</li>);
				})}
			</ul>
		);
	}
}
