import React from 'react';
import generateMatchFilter from 'nti-commons/lib/generate-match-filter';

import Group from './Group';

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

		const {associations, availableLabel, sharedToLabel} = this.props;
		const {used, unused} = associations;

		used.label = sharedToLabel;
		unused.label = availableLabel;

		this.state = {
			used: associations.used,
			unused: associations.unused
		};
	}


	onSearchChange = (value) => {
		debugger;
	}


	filterAssociations (associations, term) {
		debugger;
	}


	render () {
		const {availableLabel, sharedToLabel} = this.props;
		const {used, unused} = this.state;

		return (
			<div className="association-editor">
				<Search onChange={this.onSearchChange} buffered={false} />
				<Group group={used} />
				<Group group={unused} />
			</div>
		);
	}
}
