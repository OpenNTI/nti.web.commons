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
		const toastCount = this.state.toasts.length;
		return (
			<div>
				<button onClick={this.add}>Add Toast</button>
				<Toast.Container location="Top">
					{toastCount > 0 && (
						<Toast.Message title="Toast Count" message={toastCount.toString()} />
					)}
					{toastCount > 3 && this.state.toasts.map(
						(_, key) => (<Toast.Message title={key.toString()} key={key} />)
					)}
				</Toast.Container>
			</div>
		);
	}
}