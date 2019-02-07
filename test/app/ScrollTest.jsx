/*eslint no-console: 0*/
import React from 'react';

import {Scroll} from '../../src';

export default class Test extends React.Component {
	onTop = (d) => console.log('On Top: ', d)
	onBottom = (d) => console.log('On Bottom: ', d)
	onLeft = (d) => console.log('On Left: ', d)
	onRight = (d) => console.log('On Right: ', d)

	render () {
		return (
			<Scroll.BoundaryMonitor
				style={{width: '500px', height: '500px', overflow: 'auto'}}
				onTop={this.onTop}
				onBottom={this.onBottom}
				onLeft={this.onLeft}
				onRight={this.onRight}
			>
				<div style={{height: '1000px', width: '1000px', background: 'blue'}} />
			</Scroll.BoundaryMonitor>
		);
	}
}
