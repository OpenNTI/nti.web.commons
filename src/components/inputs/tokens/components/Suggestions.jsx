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
		matchValidity: PropTypes.object,
		label: PropTypes.string,
		getSuggestions: PropTypes.func,
		explicitAdd: PropTypes.bool,
		hideSuggestions: PropTypes.func,
		addToken: PropTypes.func,
		removeToken: PropTypes.func
	}

	state = {suggestions: null, focused: null}

	attachContainer = (node) => {
		this.container = node;

		if (this.focusedNode) {
			this.scrollToNode(this.focusedNode);
		}
	}

	attachFocused = (node) => {
		if (node && this.focusedNode !== node) {
			this.focusedNode = node;
			this.scrollToNode(node);
		}
	}

	get newToken () {
		const {hasNewToken, suggestions} = this.state;

		return hasNewToken && suggestions[0];
	}

	get suggestions () {
		const {hasNewToken, suggestions} = this.state;

		return hasNewToken ? suggestions.slice(1) : suggestions;
	}

	componentDidMount () {
		this.setup();
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


	scrollToNode (node) {
		if (!node || !this.container) { return; }

		const {container} = this;
		const containerRect = container.getBoundingClientRect();
		const nodeRect = node.getBoundingClientRect();

		const containerHeight = container.clientHeight;
		const top = nodeRect.top - containerRect.top;
		const bottom = top + nodeRect.height;

		let newTop = container.scrollTop;

		if (bottom > containerHeight) {
			newTop = bottom - containerHeight + newTop;
		} else if (top < 0) {
			newTop = newTop + top;
		}

		container.scrollTop = newTop;
	}

	/**
	 * This is called by the input component
	 *
	 * @param  {Event} e the key down event
	 * @returns {void}
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


	async setup () {
		const {match, matchValidity, selected, getSuggestions, explicitAdd} = this.props;
		const {tokens:oldTokens, focused} = this.state;

		if (!getSuggestions) {
			this.setState({suggestions: null});
			return;
		}

		const loadingTimeout = setTimeout(() => {
			this.setState({suggestions: LOADING});
		}, 100);

		const loaded = new Date();

		this.lastStart = loaded;

		try {
			const tokens = oldTokens && oldTokens.for === match ? oldTokens.value : await getSuggestions(match, selected);
			clearTimeout(loadingTimeout);

			if (this.lastStart !== loaded) {
				return;
			}

			const suggestions = cleanTokens(tokens);
			const selectedMap = (selected || []).reduce((acc, select) => ({...acc, [select.tokenId || select.value]: true}), {});
			
			const hasNewToken = explicitAdd && match &&
				(!matchValidity || matchValidity.isValid) &&
				suggestions.every(suggestion => !suggestion.isExactMatch(match)) &&
				(selected || []).every(select => !select.isExactMatch(match));

			if (hasNewToken) {
				const newToken = createToken(match, null, null, true);

				suggestions.unshift(newToken);
			}

			const newFocused = focused && ((suggestions || []).some(suggestion => suggestion.isSameToken(focused))) ? focused : null;

			this.setState({
				suggestions,
				tokens: {
					value: tokens,
					for: match
				},
				hasNewToken,
				selectedMap,
				focused: newFocused || (match !== '' ? suggestions[0] : null)
			});
		} catch (e) {
			if (this.lastStart !== loaded) {
				return;
			}

			this.setState({
				error: e,
				suggestions: null
			});
		}
	}


	addSuggestion = (suggestion) => {
		const {addToken} = this.props;

		if (addToken) {
			addToken(suggestion, true);
		}
	}


	removeSuggestion = (suggestion) => {
		const {removeToken} = this.props;

		if (removeToken) {
			removeToken(suggestion, true);
		}
	}

	render () {
		const {suggestions, error} = this.state;
		const loading = suggestions === LOADING;
		const empty = !this.suggestions || this.suggestions.length === 0;

		return (
			<div className={cx('suggestions')} ref={this.attachContainer}>
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

		if (!newToken) { return null; }

		const {focused} = this.state;
		const isFocused = focused === newToken;

		return (
			<div ref={isFocused ? this.attachFocused : null}>
				<Suggestion
					isNewToken
					match={newToken.value}
					focused={isFocused}
					suggestion={newToken}
					onClick={this.addSuggestion}
				/>
			</div>
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
					const isSelected = selectedMap[suggestion.tokenId || suggestion.value];
					const isFocused = focused && suggestion.isSameToken(focused);

					return (
						<li key={index} ref={isFocused ? this.attachFocused : null}>
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
