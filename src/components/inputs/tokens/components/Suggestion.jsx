import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Suggestion.css';
import TokenDisplay from './TokenDisplay';

const cx = classnames.bind(Styles);

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
		const {suggestion, selected, focused, match} = this.props;

		return (
			<div className={cx('suggestion', {focused, selected})} onClick={this.onClick}>
				{selected && (<i className="icon-check" />)}
				<TokenDisplay token={suggestion} match={match}/>
			</div>
		);
	}
}
