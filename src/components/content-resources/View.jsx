import React, {PropTypes} from 'react';
import cx from 'classnames';

import IconGrid from './layout/icon-grid';

export default class ContentResourcesView extends React.Component {

	static propTypes = {
		children: PropTypes.any,
		className: PropTypes.string,
		layout: PropTypes.func,//React Component "Type"
		...IconGrid.propTypes
	}


	clearSelection = () => this.props.selection.set()


	render () {
		const {children, className, contents, selection, layout} = this.props;
		const hasSubView = !!children;

		const Layout = layout || IconGrid;

		return (
			<div className={cx('content-resource-view', className, {split: hasSubView})}>
				<div className="view-main-pane" onClick={this.clearSelection}>
					<Layout contents={contents} selection={selection}/>
				</div>
				{hasSubView && (
					<div className="context-view-pane">{children}</div>
				)}
			</div>
		);
	}
}
