import React from 'react';
import generateMatchFilter from 'nti-commons/lib/generate-match-filter';

import Container from './Container';

import Search from '../../../Search';


export default class AssociationsEditor extends React.Component {
	static propTypes = {
		associations: React.PropTypes.object.isRequired,
		filterFn: React.PropTypes.func,
		regroupOnChange: React.PropTypes.bool,
		availableLabel: React.PropTypes.string,
		sharedToLabel: React.PropTypes.string
	}


	static defaultProps = {
		availableLabel: 'Available',
		sharedToLabel: 'Shared To'
	}


	constructor (props) {
		super(props);

		const {associations} = this.props;

		this.state = {
			used: associations.used,
			unused: associations.unused
		};
	}


	onSearchChange = (value) => {
		const {associations} = this.props;
		const {used, unused} = associations;

		if (!value) {
			this.setState({
				used: associations.used,
				unused: associations.unused
			});
		} else {
			this.setState({
				used: this.filterAssociations(used, value),//used.filter(x => filterFn(value, x)),
				unused: this.filterAssociations(unused, value)//unused.filter(x => filterFn(value, x))
			});
		}
	}


	filterAssociations (associations, term) {
		const {filterFn:customFilter} = this.props;
		let filterFn;

		if (customFilter) {
			filterFn = x => filterFn(x, term);
		} else {
			filterFn = generateMatchFilter(term, x => x.label || x.title);
		}

		return associations.filter(filterFn);
	}


	render () {
		const {availableLabel, sharedToLabel} = this.props;
		const {used, unused} = this.state;

		return (
			<div className="association-editor">
				<Search onChange={this.onSearchChange} buffered={false} />
				<Container label={sharedToLabel} items={used} />
				<Container label={availableLabel} items={unused} />
			</div>
		);
	}
}
