import React from 'react';

import {Text} from '../../src';

const text = 'Flogging furl overhaul boom lugsail tack Sail ho provost ahoy sloop. Quarter bilge rat chase guns list salmagundi driver interloper jolly boat  black spot spike. Furl cable case shot hulk driver sheet transom.';

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
				<Text limitLines={3} overflow={Text.Ellipsis}>
					{text}
				</Text>
			</div>
		);
	}
}