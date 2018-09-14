import React from 'react';
import PropTypes from 'prop-types';

import {Triggered} from '../../../../flyout';

import Trigger from './Trigger';
import Menu from './Menu';

const transitionTimeout = 350;

export default class NavigationTabsMenuView extends React.Component {
	static propTypes = {
		tabs: PropTypes.arrayOf(
			PropTypes.shape({
				route: PropTypes.string,
				label: PropTypes.string,
				id: PropTypes.string,
				active: PropTypes.bool
			})
		),
		renderTab: PropTypes.func
	}



	render () {
		const {tabs, renderTab} = this.props;

		if (!tabs || !tabs.length) { return null; }

		const activeTab = tabs.find(tab => tab.active);

		const trigger = (
			<Trigger tab={activeTab} hasMore={tabs.length > 1} />
		);

		return (
			<Triggered
				trigger={trigger}
				verticalAlign={Triggered.ALIGNMENTS.BOTTOM}
				horizontalAlign={Triggered.ALIGNMENTS.CENTER}
				transition={{className: 'navigation-menu', timeout: transitionTimeout}}
				className="nti-navigation-menu-flyout"
			>
				<Menu tabs={tabs} renderTab={renderTab} />
			</Triggered>
		);
	}
}
