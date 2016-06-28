import React, {PropTypes} from 'react';
import cx from 'classnames';
import SelectionModel from 'nti-commons/lib/SelectionModel';

import Folder from './Folder';
import File from './File';
import Section from './Section';

LayoutIcon.propTypes = {
	className: PropTypes.string,
	contents: PropTypes.array,
	selection: PropTypes.instanceOf(SelectionModel)
};

export default function LayoutIcon (props) {
	const {className, contents, selection} = props;

	const folders = [];
	const files = [];

	for (let item of contents) {
		let list = item.isFolder ? folders : files;
		list.push(item);
	}

	return (
		<div className={cx('content-resource-view-layout', 'icon-grid', className)}>
			<Section className="folders" items={folders} selection={selection} type={Folder}/>
			<Section className="files" items={files} selection={selection} type={File}/>
		</div>
	);
}
