import React from 'react';

import {Text} from '../../src';


export default class Test extends React.Component {
	state = {showing: false}

	show = () => {
		this.setState({
			showing: true
		});
	}

	render () {
		return (
			<div>
				<h1>Text Component Test</h1>
				<button onClick={this.show}>Show</button>
				{this.state.showing && this.renderTest()}
			</div>
		);
	}

	renderTest () {
		return (
			<div style={{maxWidth: '500px'}}>
				<Text limitLines={3} overflow={Text.Overflow.Ellipsis}>
					Flogging furl overhaul boom lugsail tack Sail ho provost ahoy sloop. Quarter bilge rat chase guns list salmagundi driver interloper jolly boat  black spot spike. <a href="www.google.com">Furl cable case shot hulk</a> driver sheet transom.
				</Text>
			</div>
		);
	}
}