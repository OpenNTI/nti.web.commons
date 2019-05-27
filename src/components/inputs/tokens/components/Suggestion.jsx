import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';

import Styles from './Suggestion.css';
import TokenDisplay from './TokenDisplay';

const cx = classnames.bind(Styles);
const t = scoped('web-commons.inputs.token.components.Suggestion', {
	newToken: 'Create "%(token)s"'
});

export default class TokenSuggestion extends React.Component {
	static propTypes = {
		match: PropTypes.string,
		isNewToken: PropTypes.bool,
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
		const {suggestion, selected, focused, match, isNewToken} = this.props;

		return (
			<div className={cx('suggestion', {focused, selected})} onClick={this.onClick}>
				{selected && (<i className="icon-check" />)}
				{isNewToken && this.renderNewToken(suggestion, match)}
				{!isNewToken && this.renderSuggestion(suggestion, match)}
			</div>
		);
	}


	renderSuggestion (suggestion, match) {
		return (
			<TokenDisplay token={suggestion} match={match}/>
		);
	}


	renderNewToken (suggestion, match) {
		return (
			<div>
				<span>{t('newToken', {token: match})}</span>
			</div>
		);
	}
}
