import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import {cleanTokens} from '../utils';

import Styles from './Suggestions.css';
import Suggestion from './Suggestion';
import keyDownStateMod from './suggestions-key-down-state-modifier';

const cx = classnames.bind(Styles);

const LOADING = 'loading';

const SELECT_TRIGGERS = ['Enter'];
const HIDE_TRIGGERS = ['Escape'];

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

	componentDidMount () {
		this.setup(this.props);
	}

	componentDidUpdate (prevProps) {
		const {match} = this.props;
		const {match:oldMatch} = prevProps;

		if (match !== oldMatch) {
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
	}


	async setup (props = this.props) {
		const {match, getSuggestions} = this.props;

		if (!getSuggestions) {
			this.setState({suggestions: null});
			return;
		}

		const loadingTimeout = setTimeout(() => {
			this.setState({suggestions: LOADING});
		}, 100);

		try {
			const suggestions = await getSuggestions(match);

			clearTimeout(loadingTimeout);

			this.setState({
				suggestions: cleanTokens(suggestions)
			});
		} catch (e) {
			this.setState({
				error: e,
				suggestions: null
			});
		}
	}


	addSuggestion = (suggestion) => {
		const {addToken} = this.props;

		if (addToken) {
			addToken(suggestion);
		}
	}


	removeSuggestion = (suggestion) => {
		const {removeToken} = this.props;

		if (removeToken) {
			removeToken(suggestion);
		}
	}


	render () {
		const {explicitAdd} = this.props;
		const {suggestions} = this.state;

		return (
			<div className={cx('suggestions')}>
				{explicitAdd && suggestions !== LOADING && this.renderCreate()}
				{this.renderSuggestions()}
			</div>
		);
	}


	renderCreate () {

	}


	renderSuggestions () {
		const {selected, match} = this.props;
		const {suggestions, error, focused} = this.state;
		const selectedMap = (selected || []).reduce((acc, select) => ({...acc, [select.value]: true}), {});

		if (error) {
			return this.renderError(error);
		}

		if (!suggestions) { return null; }

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
