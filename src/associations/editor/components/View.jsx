import React from 'react';
import matchesFilter from 'nti-commons/lib/matches-filter';

import Container from './Container';

import Search from '../../../components/Search';


function matchesTerm (item, term) {
	const value = item.title || item.label;

	return matchesFilter(value, term);
}


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
		const {associations, filterFn:customFilter} = this.props;
		const filterFn = (x) => {
			return customFilter ? customFilter(x, value) : matchesTerm(x, value);
		};

		const filtered = associations.filter(filterFn);

		this.setState({
			used: filtered.used,
			unused: filtered.unused
		});
	}


	render () {
		const {availableLabel, sharedToLabel, associations} = this.props;
		const {used, unused} = this.state;

		return (
			<div className="association-editor">
				<Search onChange={this.onSearchChange} buffered={false} />
				<Container groups={[used]} label={sharedToLabel} associations={associations} />
				<Container groups={unused} label={availableLabel} associations={associations} />
			</div>
		);
	}
}
