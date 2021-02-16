import './Token.scss';
import React from 'react';
import PropTypes from 'prop-types';

export default class Token extends React.Component {
	static propTypes = {
		onRemove: PropTypes.func,
		value: PropTypes.string.isRequired,
	};

	remove = () => {
		const { value, onRemove } = this.props;
		if (onRemove) {
			onRemove(value);
		}
	};

	render() {
		const { onRemove, value } = this.props;

		return (
			<div className="token">
				<span className="value">{value}</span>
				{onRemove && (
					<i onClick={this.remove} className="icon-bold-x small" />
				)}
			</div>
		);
	}
}
