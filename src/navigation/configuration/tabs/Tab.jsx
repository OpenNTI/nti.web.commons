import React from 'react';
import PropTypes from 'prop-types';

export default class NavigationTabConfig extends React.Component {
	static getConfigFor (props) {
		const {route, root, label, active, hide} = props;

		if (hide || typeof label !== 'string') {
			return null;
		}

		return {
			route,
			label,
			active,
			root
		};
	}

	static propTypes = {
		route: PropTypes.string.isRequired,
		root: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
		active: PropTypes.bool,
		hide: PropTypes.bool
	}

	render () {
		return null;
	}
}
