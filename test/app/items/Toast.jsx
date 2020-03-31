import React from 'react';

import {Toast} from '../../../src';

let ids = 0;

export default class Test extends React.Component {
	state = {toasts: []}

	add = () => {
		ids += 1;
		this.setState({
			toasts: [...this.state.toasts, {name: ids}]
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
				{this.state.toasts.map((toast, key) => {
					return (
						<Toast.MessageCard
							key={toast.name}
							location={Toast.Locations.TopRight}
							icon={(<i className="icon-alert" />)}
							title="No Network Connection"
							message="Please check your network connection."
							onDismiss={() => this.clearToast(toast.name)}
						/>
					);
				})}
			</div>
		);
	}
}