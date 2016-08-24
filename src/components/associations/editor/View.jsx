import React from 'react';

export default class AssociationsEditor extends React.Component {
	static propTypes = {
		associations: React.PropTypes.object.isRequired,
		filter: React.PropTypes.func,
		regroupOnChange: React.PropTypes.bool
	}


	constructor (props) {
		super(props);

		const {associations} = this.props;

		this.state = {
			used: associations.used,
			unused: associations.unused
		};
	}



	render () {
		return null;
	}
}
