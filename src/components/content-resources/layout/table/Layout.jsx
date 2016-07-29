import React, {PropTypes} from 'react';
import cx from 'classnames';
import SelectionModel from 'nti-commons/lib/SelectionModel';

import Folder from './Folder';
import File from './File';


export default class LayoutTable extends React.Component {

	static propTypes = {
		className: PropTypes.string,
		contents: PropTypes.array,
		selection: PropTypes.instanceOf(SelectionModel)
	}

	renderRow = (item, index) => {
		const {selection} = this.props;
		const Row = item.isFolder ? Folder : File;
		return ( <Row item={item} key={index} selection={selection} /> );
	}

	render () {
		const {className, contents} = this.props;

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
							<th className="column-name">Name</th>
							<th className="column-date">Date Modified</th>
							<th className="column-type">Type</th>
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
