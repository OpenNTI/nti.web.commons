import React from 'react';

import {Toast} from '../../../src';


export default class Test extends React.Component {
	state = {toasts: []}

	add = () => {
		this.setState({
			toasts: [...this.state.toasts, {name: this.state.toasts.length}]
		});
	}

	dismiss = () => this.setState({toasts: []})
	clearToast = (name) => {
		this.setState({
			toasts: this.state.toasts.filter(toast => toast.name !== name)
		});
	}

	render () {
		// const toastCount = this.state.toasts.length;
		return (
			<div>
				<button onClick={this.add}>Add Toast</button>
				<Toast.Container location="Top">
					{this.state.toasts.map((toast, key) => {
						return (
							<Toast.MessageBar
								key={key}
								title="Toast"
								message={toast.name}
								onDismiss={() => this.clearToast(toast.name)}
							/>
						);
					})}
				</Toast.Container>
			</div>
		);
	}
}