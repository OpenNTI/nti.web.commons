import React from 'react';

import { Responsive } from '../../../layouts';

import List from './list';
import Menu from './menu';

export default class NavigationTabs extends React.Component {
	renderList = () => {
		return <List {...this.props} />;
	};

	renderMenu = () => {
		return <Menu {...this.props} />;
	};

	render() {
		return (
			<React.Fragment>
				<Responsive.Item
					query={Responsive.isWebappContext}
					render={this.renderList}
				/>
				<Responsive.Item
					query={Responsive.isMobileContext}
					render={this.renderMenu}
				/>
			</React.Fragment>
		);
	}
}
