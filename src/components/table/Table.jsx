import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const EMPTY = () => null;

/*
 * A Generic Table component that takes two props: columns & items.
 *
 * You may be tempted to extend this with sort handling.
 * Remember: components render their data and call actions to update that data.
 * Therefor the burden of "sort" falls on the store and the column components
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

Table.propTypes = {
	className: PropTypes.string, // core prop, to allow customizing the table.
	columns: PropTypes.arrayOf(PropTypes.func).isRequired, //classes return 'function' as a typeof check
	items: PropTypes.shape({
		map: PropTypes.func
	}).isRequired, //rows
	store: PropTypes.any //Optional
};

export default function Table ({className, columns, items, store}) {
	const hasHeader = columns.some(x => x.HeaderComponent);
	const hasFooter = columns.some(x => x.FooterComponent);
	return (
		<table className={cx('nti-generic-table', className)}>
			{hasHeader && (
				<thead>
					<tr>
						{columns.map(({HeaderComponent = EMPTY},i) => (
							<th key={i}>
								<HeaderComponent store={store}/>
							</th>
						))}
					</tr>
				</thead>
			)}

			<tbody>
				{items.map((item, row) => (
					<tr key={row}>
						{columns.map((Cell, cell) => (
							<td key={cell}><Cell item={item} store={store}/></td>
						))}
					</tr>
				))}
			</tbody>

			{hasFooter && (
				<tfoot>
					<tr>
						{columns.map(({FooterComponent = EMPTY},i) => (
							<th key={i}>
								<FooterComponent store={store}/>
							</th>
						))}
					</tr>
				</tfoot>
			)}
		</table>
	);
}
