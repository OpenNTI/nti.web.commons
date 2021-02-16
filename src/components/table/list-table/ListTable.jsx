import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { ASCENDING } from './Constants';
import ListHeader from './ListHeader';

function applySortTo(items, sortFn) {
	return items.sort(sortFn);
}

/* @deprecated - Don't use this for new UIs. This component sorts data, mutating props,
 * and violates the Flux/React directive. Components DO NO WORK. Components issue actions,
 * which trigger work done on stores and the views Redraw.
 */
export default class ListTable extends React.Component {
	static propTypes = {
		classes: PropTypes.shape({
			className: PropTypes.string,
			headerClassName: PropTypes.string,
			bodyClassName: PropTypes.string,
		}),
		renderItem: PropTypes.func.isRequired,
		items: PropTypes.array,
		columns: PropTypes.arrayOf(
			PropTypes.shape({
				name: PropTypes.string.isRequired,
				classes: PropTypes.shape({
					name: PropTypes.string,
					default: PropTypes.string,
					inactive: PropTypes.string,
					active: PropTypes.string,
					asc: PropTypes.string,
					desc: PropTypes.string,
				}),
				display: PropTypes.string,
				sortFn: PropTypes.func.isRequired,
				defaultSort: PropTypes.bool,
			})
		),
	};

	constructor(props) {
		super(props);

		const { items } = props;
		const activeSort = this.getDefaultSort(props);

		this.state = {
			items: applySortTo(items, activeSort.sortFn),
			activeSortFn: activeSort.sortFn,
			activeSort: activeSort.name,
			activeDirection: ASCENDING,
		};
	}

	componentDidUpdate(prevProps) {
		const { items: nextItems } = this.props;
		const { items: oldItems } = prevProps;
		const { activeSortFn } = this.state;

		if (nextItems !== oldItems) {
			this.setState({
				items: applySortTo(nextItems, activeSortFn), ///!! sort mutates the array!
			});
		}
	}

	getDefaultSort(props = this.props) {
		const { columns } = props;

		for (let column of columns) {
			if (column.defaultSort) {
				return column;
			}
		}

		return columns[0];
	}

	onSortChange = (sortFn, name, direction) => {
		const { items } = this.state;

		this.setState({
			items: applySortTo(items, sortFn),
			activeSortFn: sortFn,
			activeSort: name,
			activeDirection: direction,
		});
	};

	render() {
		const { classes } = this.props;
		const { activeSort, activeDirection } = this.state;
		const cls = cx(
			'list-table',
			classes.className,
			activeSort,
			activeDirection
		);

		return (
			<div className={cls} role="table">
				{this.renderHeader()}
				{this.renderList()}
			</div>
		);
	}

	renderHeader() {
		const { columns, classes } = this.props;
		const { activeSort, activeDirection } = this.state;

		return (
			<div role="rowgroup">
				<ListHeader
					className={classes.headerClassName}
					columns={columns}
					activeSort={activeSort}
					activeDirection={activeDirection}
					onSortChange={this.onSortChange}
				/>
			</div>
		);
	}

	renderList() {
		const { renderItem, classes } = this.props;
		const { items } = this.state;
		const cls = cx('list-table-body', classes.bodyClassName);

		return (
			<div className={cls} role="rowgroup">
				{items.map((x, index) => {
					return (
						<div key={index} role="row">
							{renderItem(x, index)}
						</div>
					);
				})}
			</div>
		);
	}
}
