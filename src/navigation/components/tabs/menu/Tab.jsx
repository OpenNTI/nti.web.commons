import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class NavigationMenuTab extends React.Component {
	static propTypes = {
		tab: PropTypes.shape({
			label: PropTypes.string,
			active: PropTypes.bool
		}),
		renderTab: PropTypes.func
	}

	render () {
		const {tab, renderTab} = this.props;

		const tabCmp = (
			<div
				className={cx('nti-navigation-menu-tab', {active: tab.active})}
				data-text={tab.label}
			>
				{tab.label}
			</div>
		);

		return renderTab ? renderTab(tabCmp, tab) : tabCmp;
	}
}
