import './FilterSidebar.scss';
import React from 'react';
import PropTypes from 'prop-types';

export default class FilterSidebar extends React.Component {
	static propTypes = {
		children: PropTypes.node,
	};

	render() {
		return <div className="filter-sidebar">{this.props.children}</div>;
	}
}
