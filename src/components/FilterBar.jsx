import React from 'react';
import PropTypes from 'prop-types';
import {getEventTarget} from 'nti-lib-dom';


//Only Used by CollectionFilter.jsx
export default class FilterBar extends React.Component {
	static propTypes = {
		filters: PropTypes.array,
		filter: PropTypes.object,
		list: PropTypes.object,
		title: PropTypes.string
	}

	static contextTypes = {
		setFilter: PropTypes.func.isRequired
	}


	onSelectFilter = (e) => {
		e.stopPropagation();
		e.preventDefault();
		const {setFilter} = this.context;
		const {target} = e;

		const anchor = getEventTarget(target, 'a[href]');
		const filter = anchor.hash.substr(1);

		setFilter(filter);
	}


	getItemCount (filter) {
		const {props: {list}} = this;
		if(filter && list.filter) {
			return list.filter(filter.test).length;
		}
		return 0;
	}

	render () {
		return (
			<div>
				<h2>{this.props.title}</h2>
				{this.renderFilterBar()}
			</div>
		);
	}


	renderFilterBar  () {
		const {props: {filters = []}} = this;
		return filters.length === 0 ? null : (
			<ul className="filter-bar">
				{filters.map(this.renderFilterLink, this)}
			</ul>
		);
	}


	renderFilterLink (filter) {
		const {name, kind} = filter;
		const {props: {filter: propsFilter}} = this;
		const isActive = propsFilter.kind === filter.kind || propsFilter.name === filter.name;

		return (
			<li key={name} className={isActive ? 'active' : null}>
				<a href={`#${kind}`} onClick={this.onSelectFilter}>
					<span className="filtername">{name}</span>
					{' '/*preserves the space between spans*/}
					<span className="count">{this.getItemCount(filter)}</span>
				</a>
			</li>
		);
	}

}
