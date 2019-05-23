import React from 'react';
import PropTypes from 'prop-types';

export default class TokenDisplay extends React.Component {
	static propTypes = {
		token: PropTypes.shape({
			display: PropTypes.node.isRequired
		}).isRequired,
		match: PropTypes.string
	}

	render () {
		const {token, ...otherProps} = this.props;
		const {display} = token;

		return (<span {...otherProps}>{display}</span>);
	}
}
