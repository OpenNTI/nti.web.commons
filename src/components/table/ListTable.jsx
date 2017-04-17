import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {ASCENDING} from './Constants';
import ListHeader from './ListHeader';


function applySortTo (rows, sortFn) {
	return rows.sort(sortFn);
}



export default class ListTable extends React.Component {
	static propTypes = {
		classes: PropTypes.shape({
			className: PropTypes.string,
			headerClassName: PropTypes.string,
			bodyClassName: PropTypes.string,
		}),
		renderRow: PropTypes.func.isRequired,
		rows: PropTypes.array,
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
			sortFn: PropTypes.func.isRequired,
			defaultSort: PropTypes.bool
		}))
	}


	constructor (props) {
		super(props);

		const {rows} = props;
		const activeSort = this.getDefaultSort(props);

		this.state = {
			rows: applySortTo(rows, activeSort.sortFn),
			activeSortFn: activeSort.sortFn,
			activeSort: activeSort.name,
			activeDirection: ASCENDING
		};
	}


	componentWillReceiveProps (nextProps) {
		const {rows:nextRows} = nextProps;
		const {rows:oldRows} = this.props;
		const {activeSortFn} = this.state;

		if (nextRows !== oldRows) {
			this.setState({
				rows: applySortTo(nextRows, activeSortFn)
			});
		}
	}


	getDefaultSort (props = this.props) {
		const {columns} = props;

		for (let column of columns) {
			if (column.defaultSort) {
				return column;
			}
		}

		return columns[0];
	}


	onSortChange = (sortFn, name, direction) => {
		const {rows} = this.state;

		this.setState({
			rows: applySortTo(rows, sortFn),
			activeSortFn: sortFn,
			activeSort: name,
			activeDirection: direction
		});
	}


	render () {
		const {classes} = this.props;
		const {activeSort, activeDirection} = this.state;
		const cls = cx('list-table', classes.className, activeSort, activeDirection);

		return (
			<div className={cls} role="table">
				{this.renderHeader()}
				{this.renderList()}
			</div>
		);
	}


	renderHeader () {
		const {columns, classes} = this.props;
		const {activeSort, activeDirection} = this.state;

		return (
			<div role="rowgroup">
				<ListHeader className={classes.headerClassName} columns={columns} activeSort={activeSort} activeDirection={activeDirection} onSortChange={this.onSortChange} />
			</div>
		);
	}


	renderList () {
		const {renderRow, classes} = this.props;
		const {rows} = this.state;
		const cls = cx('list-table-body', classes.bodyClassName);

		return (
			<div className={cls} role="rowgroup">
				{rows.map((x, index) => {
					return (<div key={index} role="row">{renderRow(x, index)}</div>);
				})}
			</div>
		);
	}
}
