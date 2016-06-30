import React, {PropTypes} from 'react';
import cx from 'classnames';

import IconGrid from './layout/icon-grid';

const stop = e => e.stopPropagation();


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
			<div className={cx('content-resource-view', className, {split: hasSubView})} onClick={this.clearSelection}>
				<div className="view-main-pane">
					<Layout contents={contents} selection={selection}/>
				</div>
				{hasSubView && (
					<div className="context-view-pane" onClick={stop}>{children}</div>
				)}
			</div>
		);
	}
}
