import React from 'react';

export default class Token extends React.Component {

	static propTypes = {
		onRemove: React.PropTypes.func,
		value: React.PropTypes.string.isRequired
	}

	remove = () => {
		const {value, onRemove} = this.props;
		if (onRemove) {
			onRemove(value);
		}
	}

	render () {
		const {onRemove, value} = this.props;

		return (
			<div className="token">
				<span className="value">{value}</span>
				{onRemove && ( <i onClick={this.remove} className="icon-bold-x small"/> )}
			</div>
		);
	}
}
