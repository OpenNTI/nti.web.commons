import React from 'react';

import Container from './Container';

import Search from '../../../Search';

function defaultFilterFn (value, item) {
	const {label} = item;

	return label.toLowerCase().indexOf(value.toLowerCase()) >= 0;
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
		filterFn: defaultFilterFn,
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
		const {associations, filterFn} = this.props;
		const {used, unused} = associations;

		if (!value) {
			this.setState({
				used: associations.used,
				unused: associations.unused
			});
		} else {
			this.setState({
				used: used.filter(x => filterFn(value, x)),
				unused: unused.filter(x => filterFn(value, x))
			});
		}
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
