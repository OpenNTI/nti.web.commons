import React from 'react';

import AddClass from '../../src/components/AddClass';

export default class AddClassTest extends React.Component {

	constructor (props) {
		super(props);
		this.input = React.createRef();
	}

	state = {}

	toggle = () => {
		this.setState({
			on: !this.state.on
		});
	}

	change = () => {
		const {value = 'darkmode'} = this.input.current || {};
		if (value !== this.state.value) {
			this.setState({
				value
			});
		}
	}


	render () {
		const {on, value = 'darkmode'} = this.state;

		return (
			<div>
				{on && <AddClass className={value} />}
				<input defaultValue="darkmode" ref={this.input} />
				<button onClick={this.change}>change class</button>
				<button onClick={this.toggle}>Cleeek.</button>
			</div>
		);
	}
}
