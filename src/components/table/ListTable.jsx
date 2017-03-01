import React from 'react';
import cx from 'classnames';

import {DESCENDING} from './Constants';
import ListHeader from './ListHeader';


function applySortTo (items, sortFn) {
	debugger;
	return items.sort(sortFn);
}



export default class ListTable extends React.Component {
	static propTypes = {
		className: React.PropTypes.string,
		headerClassName: React.PropTypes.string,
		bodyClassName: React.PropTypes.string,
		items: React.PropTypes.array,
		renderItem: React.PropTypes.func.isRequired,
		cells: React.PropTypes.arrayOf(React.PropTypes.shape({
			name: React.PropTypes.string.isRequired,
			className: React.PropTypes.string,
			display: React.PropTypes.string,
			sortFn: React.PropTypes.func.isRequired
		})),
		defaultSort: React.PropTypes.string
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

		debugger;

		return (
			<ul className={cls}>
				{items.map((x, index) => {
					return (<li key={index}>{renderItem(x, index)}</li>);
				})}
			</ul>
		);
	}
}
