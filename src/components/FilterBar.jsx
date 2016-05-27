import React from 'react';

import NavigatableMixin from '../mixins/NavigatableMixin';

export default React.createClass({
	displayName: 'FilterBar',
	mixins: [NavigatableMixin],

	propTypes: {
		filters: React.PropTypes.array,
		filter: React.PropTypes.object,
		list: React.PropTypes.object,
		title: React.PropTypes.string
	},


	getItemCount (filter) {
		const {props: {list}} = this;
		if(filter && list.filter) {
			return list.filter(filter.test).length;
		}
		return 0;
	},

	render () {
		return (
			<div>
				<h2>{this.props.title}</h2>
				{this.renderFilterBar()}
			</div>
		);
	},


	renderFilterBar  () {
		const {props: {filters = []}} = this;
		return filters.length === 0 ? null : (
			<ul className="filter-bar">
				{filters.map(this.renderFilterLink)}
			</ul>
		);
	},


	renderFilterLink (filter) {
		const {name, kind} = filter;
		const {props: {filter: propsFilter}} = this;
		const isActive = propsFilter.kind === filter.kind || propsFilter.name === filter.name;
		const Link = this.getLinkComponent();

		return (
			<li key={name} className={isActive ? 'active' : null}>
				<Link href={`/${kind}`}>
					<span className="filtername">{name}</span>
					{' '/*preserves the space between spans*/}
					<span className="count">{this.getItemCount(filter)}</span>
				</Link>
			</li>
		);
	}

});
