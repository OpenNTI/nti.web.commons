import {resolve} from 'path';

import React from 'react';
import PropTypes from 'prop-types';

import Store from '../../Store';

import Tab from './Tab';

function getTabConfig (tab, index, baseRoute) {
	if (tab.type !== Tab) {
		return null;
	}

	const {route, label, ...otherProps} = Tab.getConfigFor(tab.props);

	return {
		...otherProps,

		//TODO: figure out if there's a better way to join these paths
		route: baseRoute ? resolve(baseRoute, route) : route,
		label,
		id: `${label}-${index}`
	};
}

export default
@Store.connect(['setTabs', 'clearTabs'])
class NavigationTabsConfig extends React.Component {
	static Tab = Tab

	static propTypes = {
		children: PropTypes.any,
		baseRoute: PropTypes.string,

		setTabs: PropTypes.func,
		clearTabs: PropTypes.func
	}


	componentDidMount () {
		this.setupFor(this.props);
	}


	componentDidUpdate (prevProps) {
		const {children: prevChildren, baseRoute: prevRoute} = prevProps;
		const {children, baseRoute} = this.props;

		if (prevChildren !== children || prevRoute !== baseRoute) {
			this.setupFor(this.props);
		}
	}


	componentWillUnmount () {
		const {clearTabs} = this.props;

		if (clearTabs && this.tabs) {
			clearTabs(this.tabs);
		}
	}


	setupFor (props) {
		const {setTabs, children, baseRoute} = props;

		const tabs = React.Children.map(children, (tab, index) => getTabConfig(tab, index, baseRoute)).filter(x => !!x);

		this.tabs = tabs;
		setTabs(tabs);
	}


	render () {
		return null;
	}
}
