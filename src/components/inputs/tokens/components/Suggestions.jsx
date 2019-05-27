import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Events} from '@nti/lib-commons';

import {Spinner} from '../../../loading-indicators';
import {cleanTokens, createToken} from '../utils';

import Styles from './Suggestions.css';
import Suggestion from './Suggestion';
import keyDownStateMod from './suggestions-key-down-state-modifier';

const cx = classnames.bind(Styles);

const LOADING = 'loading';

const SELECT_TRIGGERS = ['Enter'];

export default class TokenSuggestions extends React.Component {
	static propTypes = {
		selected: PropTypes.array,
		match: PropTypes.string,
		label: PropTypes.string,
		getSuggestions: PropTypes.func,
		explicitAdd: PropTypes.bool,
		hideSuggestions: PropTypes.func,
		addToken: PropTypes.func,
		removeToken: PropTypes.func
	}

	state = {suggestions: null, focused: null}

	get newToken () {
		const {hasNewToken, suggestions} = this.state;

		return hasNewToken && suggestions[0];
	}

	get suggestions () {
		const {hasNewToken, suggestions} = this.state;

		return hasNewToken ? suggestions.slice(1) : suggestions;
	}

	componentDidMount () {
		this.setup(this.props);
	}

	componentDidUpdate (prevProps) {
		const {match, selected} = this.props;
		const {match:oldMatch, selected:oldSelected} = prevProps;

		if (match !== oldMatch || selected !== oldSelected) {
			this.setup();
		}
	}

	componentWillUnmount () {
		this.unmounted = true;
	}

	/**
	 * This is called by the input component
	 *
	 * @param  {Event} e the key down event
	 * @return {void}
	 */
	onInputKeyDown = (e) => {
		if (this.unmounted) { return; }

		const newState = keyDownStateMod(e, this.state);

		if (newState !== this.state) {
			this.setState(newState);
			return;
		}

		const {focused, selectedMap} = this.state;
		const {key} = e;

		if (SELECT_TRIGGERS.indexOf(key) > -1 && focused) {
			Events.stop(e);

			if (selectedMap[focused.value]) {
				this.removeSuggestion(focused);
			} else {
				this.addSuggestion(focused);
			}
		}
	}


	async setup (props = this.props) {
		const {match, selected, getSuggestions, explicitAdd} = this.props;

		if (!getSuggestions) {
			this.setState({suggestions: null});
			return;
		}

		const loadingTimeout = setTimeout(() => {
			this.setState({suggestions: LOADING});
		}, 100);

		try {
			const loaded = new Date();

			this.lastStart = loaded;

			const tokens = await getSuggestions(match);
			clearTimeout(loadingTimeout);

			if (this.lastStart !== loaded) {
				return;
			}

			const suggestions = cleanTokens(tokens);
			const selectedMap = (selected || []).reduce((acc, select) => ({...acc, [select.value]: true}), {});
			const hasNewToken = explicitAdd && match && suggestions.every(suggestion => !suggestion.isExactMatch(match));

			if (hasNewToken) {
				const newToken = createToken(match, null, null, true);

				suggestions.unshift(newToken);
			}


			this.setState({
				suggestions,
				hasNewToken,
				selectedMap
			});
		} catch (e) {
			this.setState({
				error: e,
				suggestions: null
			});
		}
	}


	addSuggestion = (suggestion) => {
		const {newToken} = this;
		const {addToken} = this.props;

		if (addToken) {
			addToken(suggestion, newToken && newToken.isSameToken(suggestion));
		}
	}


	removeSuggestion = (suggestion) => {
		const {removeToken} = this.props;

		if (removeToken) {
			removeToken(suggestion);
		}
	}

	render () {
		const {suggestions, error} = this.state;
		const loading = suggestions === LOADING;
		const empty = !this.suggestions || this.suggestions.length === 0;

		return (
			<div className={cx('suggestions')}>
				{error && this.renderError()}
				{!error && loading && this.renderLoading()}
				{!error && !loading && this.renderNewToken()}
				{!error && !loading && empty && this.renderEmpty()}
				{!error && !loading && !empty && this.renderLabel()}
				{!error && !loading && !empty && this.renderSuggestions()}
			</div>
		);
	}

	renderError () {

	}


	renderLoading () {
		return (
			<div className={cx('loading')}>
				<Spinner />
			</div>
		);
	}


	renderEmpty () {
		return null;
	}


	renderLabel () {
		const {label} = this.props;

		return label ?
			(<span className={cx('suggestions-label')}>{label}</span>) :
			null;
	}


	renderNewToken () {
		const {newToken} = this;
		const {focused} = this.state;

		if (!newToken) { return null; }

		return (
			<Suggestion
				isNewToken
				match={newToken.value}
				focused={focused === newToken}
				suggestion={newToken}
				onClick={this.addSuggestion}
			/>
		);
	}


	renderSuggestions () {
		const {suggestions} = this;
		const {match} = this.props;
		const {focused, selectedMap} = this.state;

		if (!suggestions || suggestions.length === 0) { return null; }

		return (
			<ul className={cx('suggestions-list')}>
				{suggestions.map((suggestion, index) => {
					const isSelected = selectedMap[suggestion.value];
					const isFocused = focused && suggestion.isSameToken(focused);

					return (
						<li key={index}>
							<Suggestion
								selected={isSelected}
								focused={isFocused}
								match={match}
								suggestion={suggestion}
								onClick={isSelected ? this.removeSuggestion : this.addSuggestion}
							/>
						</li>
					);
				})}
			</ul>
		);
	}
}
