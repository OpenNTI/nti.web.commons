import React from 'react';
import PropTypes from 'prop-types';

import Tabs from './components/tabs';
import TabsConfig from './configuration/tabs';
import Store from './Store';

export default
@Store.connect(['tabs'])
class NavigationComponent extends React.Component {
	static Tabs = TabsConfig

	static propTypes = {
		tabs: PropTypes.array
	}

	render () {
		const {tabs, ...otherProps} = this.props;

		return (
			<div>
				<Tabs tabs={tabs} {...otherProps} />
			</div>
		);
	}
}
