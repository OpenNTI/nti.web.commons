import { resolve } from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import { decorate } from '@nti/lib-commons';

import Store from '../../Store';

import Tab from './Tab';

function getTabConfig(tab, index, baseRoute) {
	if (tab.type !== Tab) {
		return null;
	}

	const { route, label, ...otherProps } = Tab.getConfigFor(tab.props);

	return {
		...otherProps,

		//TODO: figure out if there's a better way to join these paths
		route: baseRoute ? resolve(baseRoute, route) : route,
		label,
		id: `${label}-${index}`,
	};
}

class NavigationTabsConfig extends React.Component {
	static Tab = Tab;

	static propTypes = {
		children: PropTypes.any,
		baseRoute: PropTypes.string,
		expandTabs: PropTypes.bool,

		setTabs: PropTypes.func,
		clearTabs: PropTypes.func,

		setExpandTabs: PropTypes.func,
	};

	componentDidMount() {
		this.setupFor(this.props);
	}

	componentDidUpdate(prevProps) {
		const { children: prevChildren, baseRoute: prevRoute } = prevProps;
		const { children, baseRoute } = this.props;

		if (prevChildren !== children || prevRoute !== baseRoute) {
			this.setupFor(this.props);
		}
	}

	componentWillUnmount() {
		const { clearTabs } = this.props;

		if (clearTabs && this.tabs) {
			clearTabs(this.tabs);
		}
	}

	setupFor(props) {
		const {
			setExpandTabs,
			expandTabs,
			setTabs,
			children,
			baseRoute,
		} = props;

		setExpandTabs(expandTabs);

		const tabs = React.Children.map(children, (tab, index) =>
			getTabConfig(tab, index, baseRoute)
		).filter(x => !!x);

		this.tabs = tabs;
		setTabs(tabs);
	}

	render() {
		return null;
	}
}

export default decorate(NavigationTabsConfig, [
	Store.connect(['setTabs', 'clearTabs', 'setExpandTabs']),
]);
