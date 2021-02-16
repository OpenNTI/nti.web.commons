import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { scoped } from '@nti/lib-locale';

import Styles from './Suggestion.css';
import TokenDisplay from './TokenDisplay';

const cx = classnames.bind(Styles);
const t = scoped('web-commons.inputs.token.components.Suggestion', {
	newToken: 'Create "%(token)s"',
});

export default class TokenSuggestion extends React.Component {
	static propTypes = {
		match: PropTypes.string,
		isNewToken: PropTypes.bool,
		suggestion: PropTypes.object,
		selected: PropTypes.bool,
		focused: PropTypes.bool,
		onClick: PropTypes.func,
	};

	onClick = () => {
		const { onClick, suggestion } = this.props;

		if (onClick) {
			onClick(suggestion);
		}
	};

	render() {
		const { suggestion, selected, focused, match, isNewToken } = this.props;

		return (
			<div
				className={cx('suggestion', { focused, selected })}
				onClick={this.onClick}
			>
				{selected && <i className={cx('icon-check', 'check-mark')} />}
				{isNewToken && this.renderNewToken(suggestion, match)}
				{!isNewToken && this.renderSuggestion(suggestion, match)}
			</div>
		);
	}

	renderSuggestion(suggestion, match) {
		return (
			<TokenDisplay
				className={cx('suggestion-display')}
				token={suggestion}
				match={match}
			/>
		);
	}

	renderNewToken(suggestion, match) {
		return (
			<div className={cx('new-token')}>
				<i className={cx('icon-add')} />
				<span className={cx('new-token-display')}>
					{t('newToken', { token: match })}
				</span>
			</div>
		);
	}
}
