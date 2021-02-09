import React from 'react';
import PropTypes from 'prop-types';
import {decorate} from '@nti/lib-commons';

import Tabs from './components/tabs';
import TabsConfig from './configuration/tabs';
import Store from './Store';

class NavigationComponent extends React.Component {
	static Tabs = TabsConfig

	static propTypes = {
		tabs: PropTypes.array,
		expandTabs: PropTypes.bool
	}

	render () {
		const {tabs, expandTabs, ...otherProps} = this.props;

		return (
			<div>
				<Tabs tabs={tabs} expandTabs={expandTabs} {...otherProps} />
			</div>
		);
	}
}


export default decorate(NavigationComponent, [
	Store.connect(['tabs', 'expandTabs'])
]);
