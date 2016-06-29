import React, {PropTypes} from 'react';
import cx from 'classnames';

import IconGrid from './layout/icon-grid';

ContentResourcesView.propTypes = {
	children: PropTypes.any,
	className: PropTypes.string,
	layout: PropTypes.func,//React Component "Type"
	...IconGrid.propTypes
};

export default function ContentResourcesView (props) {
	const {children, className, contents, selection, layout} = props;
	const hasSubView = !!children;

	const Layout = layout || IconGrid;

	return (
		<div className={cx('content-resource-view', className, {split: hasSubView})}>
			<div className="view-main-pane" onClick={()=> selection.set()}>
				<Layout contents={contents} selection={selection}/>
			</div>
			{hasSubView && (
				<div className="context-view-pane">{children}</div>
			)}
		</div>
	);
}
