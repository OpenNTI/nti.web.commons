import './Table.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import SimpleHeader from './SimpleHeader';

const EMPTY = () => null;

/*
 * A Generic Table component that takes two props: columns & items.
 *
 * You may be tempted to extend this with sort handling.
 * Remember: components render their data and call actions to update that data.
 * Therefore the burden of "sort" falls on the store and the column components
 * to know how to display sort state.
 *
 * As a concession, it takes an optional prop "store" and passes it to the cells
 * of the table. Consider using context to connect the column header/footer/cells
 * together.
 *
 *
 * To define a Column component, make its primary function render the cell in the
 * body of the table. Add static class properties called "HeaderComponent" and/or
 * "FooterComponent" if you need a header/footer. These static properties will be
 * used to flag whether or not to add the thead/tfoot.
 *
 *   class ExampleColumn extends React.Component {
 *   	static propTypes = {
 *   		item: PropTypes.object.isRequired
 *   	}
 *
 *   	static HeaderComponent = () => <div/>	// These can be imported and assigned
 *   											// if you have a complex header/footer
 *   	static FooterComponent = () => <div/>
 *
 *   	render () {
 *   		return (
 *   			<div />
 *   		);
 *   	}
 *   }
 */

export default class Table extends React.Component {
	
	static propTypes = {
		className: PropTypes.string, // core prop, to allow customizing the table.
		columns: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object])).isRequired, //classes return 'function' as a typeof check
		items: PropTypes.oneOfType([
			PropTypes.shape({
				map: PropTypes.func
			}),
			PropTypes.array
		]).isRequired, //rows
		store: PropTypes.any, //Optional
		rowClassName: PropTypes.func,
		sortOn: PropTypes.string,
		sortDirection: PropTypes.string,
		onSortChange: PropTypes.func,
		onRowClick: PropTypes.func
	}

	render () {
		const {
			className,
			columns,
			items,
			store,
			rowClassName,
			sortOn,
			sortDirection,
			onSortChange,
			onRowClick
		} = this.props;

		const hasHeader = columns.some(x => x.HeaderComponent || x.Name);
		const hasFooter = columns.some(x => x.FooterComponent);

		return (
			<table className={cx('nti-generic-table', className)}>
				{hasHeader && (
					<thead>
						<tr>
							{columns.map(({HeaderComponent = EMPTY, cssClassName, Name, SortKey},i) => (
								<th key={i} className={cx(cssClassName, Name && 'nti-table-simple-header')}>
									{HeaderComponent && HeaderComponent !== EMPTY
										? <HeaderComponent store={store} onSortChange={onSortChange} sortOn={sortOn} sortDirection={sortDirection}/>
										: <SimpleHeader sortKey={SortKey} name={Name} onSortChange={onSortChange} sortOn={sortOn} sortDirection={sortDirection}/>
									}
								</th>
							))}
						</tr>
					</thead>
				)}
		
				<tbody>
					{items.map((item, row) => (
						<Row key={row}
							item={item}
							columns={columns}
							className={!rowClassName ? void 0 : rowClassName(item, row, items)}
							store={store}
							onClick={onRowClick}
						/>
					))}
				</tbody>
		
				{hasFooter && (
					<tfoot>
						<tr>
							{columns.map(({FooterComponent = EMPTY, cssClassName},i) => (
								<th key={i} className={cssClassName}>
									<FooterComponent store={store}/>
								</th>
							))}
						</tr>
					</tfoot>
				)}
			</table>
		);
	}
}

class Row extends React.Component {

	static propTypes = {
		columns: PropTypes.array,
		item: PropTypes.any,
		store: PropTypes.any,
		onClick: PropTypes.func
	}

	onClick = e => {
		const {item, onClick} = this.props;

		if (onClick) {
			onClick(item, e);
		}
	}

	render () {
		const {columns, item, store, onClick} = this.props;
		const clickHandler = onClick ? this.onClick : void 0;

		return (
			<tr onClick={clickHandler}>
				{columns.map((Cell, cell) => (
					Cell.rendersContainer
						? <Cell key={cell} item={item} store={store} />
						: <td key={cell} className={Cell.cssClassName}><Cell item={item} store={store} /></td>
				))}
			</tr>
		);
	}
}
