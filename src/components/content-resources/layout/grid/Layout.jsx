import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Selection } from '@nti/lib-commons';

import Folder from './Folder';
import File from './File';
import Section from './Section';

LayoutGrid.propTypes = {
	className: PropTypes.string,
	contents: PropTypes.array,
	selection: PropTypes.instanceOf(Selection.Model),
};

export default function LayoutGrid(props) {
	const { className, contents, selection } = props;

	const folders = [];
	const files = [];

	for (let item of contents) {
		let list = item.isFolder ? folders : files;
		list.push(item);
	}

	return (
		<div className={cx('content-resource-view-layout', 'grid', className)}>
			<Section
				className="folders"
				items={folders}
				selection={selection}
				type={Folder}
			/>
			<Section
				className="files"
				items={files}
				selection={selection}
				type={File}
			/>
		</div>
	);
}
