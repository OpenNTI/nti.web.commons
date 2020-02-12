import React from 'react';

import {Toast} from '../../../src';


export default class Test extends React.Component {
	state = {toasts: []}

	add = () => {
		this.setState({
			toasts: [...this.state.toasts, {}]
		});
	}

	render () {
		return (
			<div>
				<button onClick={this.add}>Add Toast</button>
				<Toast.Container location="Top">
					{this.state.toasts.map((_, key) => (<Toast key={key} />))}
				</Toast.Container>
			</div>
		);
	}
}