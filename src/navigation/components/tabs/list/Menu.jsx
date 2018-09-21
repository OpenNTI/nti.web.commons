import React from 'react';
import PropTypes from 'prop-types';

import Tab from './Tab';

export default class NavigationTabListMenu extends React.Component {
	static propTypes = {
		tabs: PropTypes.array,
		renderTab: PropTypes.func,
		onDismiss: PropTypes.func
	}


	onDismiss = () => {
		const {onDismiss} = this.props;

		if (onDismiss) {
			onDismiss();
		}
	}


	render () {
		const {tabs, renderTab} = this.props;

		return (
			<ul className="nti-navigation-tabs-menu-tabs">
				{
					tabs.map((tab) => {
						return (
							<li key={tab.id}>
								<Tab tab={tab} renderTab={renderTab} onDismiss={this.onDismiss} inMenu/>
							</li>
						);
					})
				}
			</ul>
		);
	}
}
