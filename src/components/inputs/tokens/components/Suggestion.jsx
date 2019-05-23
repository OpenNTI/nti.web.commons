import React from 'react';
import PropTypes from 'prop-types';

import TokenDisplay from './TokenDisplay';

export default class TokenSuggestion extends React.Component {
	static propTypes = {
		match: PropTypes.string,
		suggestion: PropTypes.object,
		selected: PropTypes.bool,
		focused: PropTypes.bool,
		onClick: PropTypes.bool
	}

	onClick = () => {
		const {onClick, suggestion} = this.props;

		if (onClick) {
			onClick(suggestion);
		}
	}


	render () {
		const {suggestion, selected, match} = this.props;

		return (
			<div onClick={this.onClick}>
				{selected && (<i className="icon-check" />)}
				<TokenDisplay token={suggestion} match={match}/>
			</div>
		);
	}
}
