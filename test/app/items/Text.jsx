import React from 'react';

import {Text} from '../../../src';


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
				<h1 style={{fontFamily: 'Open Sans Condensed'}}>Text Component Test</h1>
				<button onClick={this.show}>Show</button>
				{this.state.showing && this.renderTest()}
			</div>
		);
	}

	renderTest () {
		return (
			<div style={{maxWidth: '152px'}}>
				<Text limitLines={2} overflow={Text.Overflow.Ellipsis} linkify style={{width: '152px', padding: '0 20px', lineHeight: '1.3', fontFamily: 'Open Sans Condensed', fontWeight: 700}}>
					Understanding and Detecting Deception
				</Text>
			</div>
		);
	}
}