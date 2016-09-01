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
	}


	render () {
		const {availableLabel, sharedToLabel} = this.props;
		const {used, unused} = this.state;

		return (
			<div className="association-editor">
				<Search onChange={this.onSearchChange} buffered={false} />
				<Container groups={[used]} label={sharedToLabel}/>
				<Container groups={unused} label={availableLabel}/>
			</div>
		);
	}
}
