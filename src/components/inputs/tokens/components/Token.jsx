import React from 'react';
import PropTypes from 'prop-types';

import TokenDisplay from './TokenDisplay';

export default class Token extends React.Component {
	static propTypes = {
		token: PropTypes.object,
		onRemove: PropTypes.func,
		onSelect: PropTypes.func
	}

	onRemove = (e) => {
		e.stopPropagation();
		e.preventDefault();

		const {onRemove, token} = this.props;

		if (onRemove) {
			onRemove(token);
		}
	}

	onSelect = (e) => {
		const {onSelect, token} = this.props;

		if (onSelect) {
			onSelect(token);
		}
	}

	render () {
		const {token, onRemove} = this.props;

		return (
			<div onClick={this.onSelect}>
				<TokenDisplay token={token} />
				{!!onRemove && (
					<div onClick={this.onRemove}>
						<i className="icon-remove" />
					</div>
				)}
			</div>
		);
	}
}
