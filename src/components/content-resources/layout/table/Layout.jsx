import React, {PropTypes} from 'react';
import cx from 'classnames';
import SelectionModel from 'nti-commons/lib/SelectionModel';

import ColumnHead from './ColumnHead';
import Folder from './Folder';
import File from './File';


export default class LayoutTable extends React.Component {

	static propTypes = {
		className: PropTypes.string,
		contents: PropTypes.array,
		selection: PropTypes.instanceOf(SelectionModel),
		sort: PropTypes.shape({
			sortOn: PropTypes.string,
			sortOrder: PropTypes.oneOf(['asc', 'desc'])
		}),
		onSortChanged: PropTypes.func
	}

	renderRow = (item, index) => {
		const {selection} = this.props;
		const Row = item.isFolder ? Folder : File;
		return ( <Row item={item} key={index} selection={selection} /> );
	}

	render () {
		const {className, contents, sort, onSortChanged: onSort} = this.props;

		const folders = [];
		const files = [];

		for (let item of contents) {
			let list = item.isFolder ? folders : files;
			list.push(item);
		}

		const groupped = [...folders, ...files];

		return (
			<div className={cx('content-resource-view-layout', 'table', className)}>
				<table cellSpacing="0">
					<thead>
						<tr>
							<ColumnHead className="column-name" sortOn="name" currentSort={sort} onSort={onSort}>
								Name
							</ColumnHead>
							<ColumnHead className="column-date" sortOn="lastModified" currentSort={sort} onSort={onSort}>
								Date Modified
							</ColumnHead>
							<ColumnHead className="column-type" sortOn="type" currentSort={sort} onSort={onSort}>
								Type
							</ColumnHead>
						</tr>
					</thead>
					<tbody>
						{groupped.map(this.renderRow)}
					</tbody>
				</table>
			</div>
		);
	}
}
