import React from 'react';

export default class Container extends React.Component {
	static propTypes = {
		label: React.PropTypes.string,
		items: React.PropTypes.array
	}


	static defaultProps = {
		items: []
	}


	render () {
		const {label, items} = this.props;

		return (
			<div className="association-container">
				<h4>{label}</h4>
				<ul>
					{items.map(this.renderItem)}
				</ul>
			</div>
		);
	}


	renderItem = (item) => {
		return (
			<li key={item.NTIID || item.ID}>
				{item.label}
			</li>
		);
	}
}
