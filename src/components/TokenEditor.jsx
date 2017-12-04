import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import isEmpty from 'isempty';
import Logger from 'nti-util-logger';

import Token from './Token';

const logger = Logger.get('common:components:TokenEditor');

const SUGGESTION_BUFFER = 300;
const BLUR_DELAY = 500;

class Suggestion extends React.Component {
	static propTypes = {
		suggestion: PropTypes.object.isRequired,
		onClick: PropTypes.func,
		selected: PropTypes.bool
	}

	onSuggestionClick = () => {
		const { onClick, suggestion } = this.props;

		onClick && onClick(suggestion);
	}

	render () {
		const { suggestion, selected } = this.props;

		const classes = cx('suggestion', { selected });

		return (<div className={classes} onClick={this.onSuggestionClick}>{suggestion.view || suggestion}</div>);
	}
}

/**
 * Suggestions generated by suggestionProvider can be either an array of simple string values:
 *
 * ["suggestion1", "suggestion2", ...]
 *
 * or an array of objects consisting of a string value and a view (JSX expression):
 *
 * [
 * 	{
 * 		display: "suggestion1",
 * 		value: { ... },
 * 		view: "<div>Suggestion Display</div>"
 *  },
 *   ...
 * ]
 *
 * Values provided on the onChange event will be the full suggestion object, or a simple string value
 * if no suggestion was used
 */

export default class TokenEditor extends React.Component {

	static propTypes = {
		tokens: PropTypes.array,//deprecated... we need to conform to the "value/onChange" api.
		value: PropTypes.array,
		onChange: PropTypes.func,
		onFocus: PropTypes.func,
		className: PropTypes.string,
		preprocessToken: PropTypes.func,
		placeholder: PropTypes.string,
		tokenDelimiterKeys: PropTypes.arrayOf(PropTypes.string),
		suggestionProvider: PropTypes.func,
		maxTokenLength: PropTypes.number,
		disabled: PropTypes.bool,
		onlyAllowSuggestions: PropTypes.bool
	}

	state = {inputValue: ''}

	get value () {
		return [...this.state.values];
	}


	attachInputRef = x => this.input = x


	constructor (props) {
		if (props.tokens) {
			props = {value: props.tokens, ...props};
			delete props.tokens;
			logger.warn('tokens prop is deprecated, use value instead.');
		}
		super(props);

		this.state = {
			selectedSuggestionIndex: -1,
			suggestions: undefined
		};
	}

	cancelReset () {}

	cancel = () => {
		this.cancelReset && this.cancelReset();
	}


	componentWillMount () {
		this.initState();
	}


	componentWillUnmount () {
		this.cancel();
	}


	componentWillReceiveProps (nextProps) {
		if (nextProps.value !== this.props.value) {
			this.initState(nextProps);
			this.cancel();
		}
	}


	initState (props = this.props) {
		this.setState({
			inputValue: '',
			values: [... new Set(props.value)]//dedupe
		});
	}


	resetSuggestionState () {
		clearTimeout(this.inputBuffer);

		this.setState({
			suggestions: undefined,
			selectedSuggestionIndex: -1
		});
	}


	add = (value) => {
		this.resetSuggestionState();

		let v = value;
		if (isEmpty(v)) {
			return;
		}
		if (this.props.preprocessToken) {
			v = this.props.preprocessToken(v);
		}

		const {values} = this.state;
		if (!values.includes(v)) {
			this.setState(
				{values: [...values, v]},
				()=> this.onChange()
			);
		}
	}


	remove = (value) => {
		const {values} = this.state;
		const filtered =  values.filter(x => x !== value && x.display !== value);

		if (filtered.length < values.length) {
			this.setState(
				{values: filtered},
				()=> this.onChange()
			);
		}
	}


	clearInput = () => {
		this.setState({ inputValue: '', suggestions: undefined, loadingSuggestions: false });
	}


	focusInput = () => {
		if (this.input) {
			this.input.focus();
		}
		if (this.props.onFocus) {
			this.props.onFocus();
		}
	}

	addIfValid (value) {
		if(value && value.trim() !== '') {
			this.add(value);
			this.clearInput();
		}
	}

	onBlur = (e) => {
		const { onlyAllowSuggestions } = this.props;
		// this.add(e.target.value);
		// this.clearInput();

		// give a little delay before hiding suggestions on blur
		const taskId = {};
		this.currentTask = taskId;
		const timerId = setTimeout(() => this.currentTask === taskId && this.resetSuggestionState(), BLUR_DELAY);

		this.cancel(); // cancels existing timer if any

		this.cancelReset = () => clearTimeout(timerId);

		if(!onlyAllowSuggestions) {
			// on blur, add token as if a delimiter key was hit
			this.addIfValid(e.target.value);
		}
	}


	onChange = () => {
		const {props: {onChange}, state: {values}} = this;

		if (onChange) {
			onChange(values);
		}
	}


	onInputChange = (e) => {
		const { selectedSuggestionIndex, suggestions } = this.state;
		const value = e.target.value;

		clearTimeout(this.inputBuffer);

		let newState = {
			inputValue: value
		};

		if(suggestions && selectedSuggestionIndex >= suggestions.length) {
			newState.selectedSuggestionIndex = -1;
		}

		if(value === '') {
			newState.suggestions = undefined;
			newState.selectedSuggestionIndex = -1;
		}

		this.setState(newState);

		if(value !== '') {
			// load suggestions if there is anything search for
			this.inputBuffer = setTimeout(() => {
				this.loadSuggestions(value);
			}, SUGGESTION_BUFFER);
		}
	}


	loadSuggestions (value, forceEmpty, callback) {
		const { suggestionProvider } = this.props;

		if(value === '' && !forceEmpty) {
			this.setState({suggestions: undefined});
		}
		else if(suggestionProvider) {
			this.setState({ loadingSuggestions: true });

			suggestionProvider(value).then((newSuggestions) => {
				this.setState({
					suggestions: newSuggestions,
					loadingSuggestions: false
				}, () => { callback && callback(); });
			}).catch(() => {
				this.setState({
					suggestions: undefined,
					loadingSuggestions: false
				}, () => { callback && callback(); });
			});
		}
	}


	getTokenEditor = (el) => {
		let parent = el.parentNode;

		while(parent) {
			if(parent.className === 'token-editor') {
				return parent;
			}

			parent = parent.parentNode;
		}

		return null;
	}


	getSuggestionsContainer = (tokenEditor) => {
		return tokenEditor.getElementsByClassName('suggestions-container')[0];
	}


	getSelectedSuggestion = (suggestionContainer) => {
		const selected = suggestionContainer.getElementsByClassName('selected');

		return selected && selected[0];
	}


	adjustSuggestionScroll = (el) => {
		const suggestionsContainer = this.getSuggestionsContainer(this.getTokenEditor(el));
		const selectedSuggestion = this.getSelectedSuggestion(suggestionsContainer);

		if(selectedSuggestion) {
			const containerRect = suggestionsContainer.getBoundingClientRect();
			const itemRect = selectedSuggestion.getBoundingClientRect();

			if(itemRect.top > containerRect.bottom) {
				suggestionsContainer.scrollTop += itemRect.height;
			}
			else if(itemRect.top < containerRect.top) {
				suggestionsContainer.scrollTop = selectedSuggestion.offsetTop;
			}
		}
	}


	onKeyDown = (e) => {
		const { suggestions, selectedSuggestionIndex, loadingSuggestions } = this.state;
		const { onlyAllowSuggestions } = this.props;
		const { target } = e;

		const finishingKeys = this.props.tokenDelimiterKeys || ['Enter', 'Tab', ' ', ','];
		if (finishingKeys.indexOf(e.key) > -1) {
			e.stopPropagation();
			e.preventDefault();

			if(suggestions && suggestions.length > 0 && selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
				this.add(suggestions[selectedSuggestionIndex]);
				this.clearInput();
			}
			else if(!onlyAllowSuggestions) {
				// if onlyAllowSuggestions mode, don't allow this free text to be entered as a token.  Force user to
				// select from a suggestion
				this.addIfValid(target.value);
			}
		}
		else if(e.key === 'ArrowDown') {
			if(loadingSuggestions) {
				// don't interrupt anything if we're still loading
				return;
			}

			if(suggestions && suggestions.length > 0) {
				let newSelection = Math.min(selectedSuggestionIndex + 1, suggestions.length - 1);

				this.setState({
					selectedSuggestionIndex: newSelection,
					inputValue: this.getValueForSuggestion(suggestions[newSelection])
				}, () => {
					this.adjustSuggestionScroll(target);
				});
			}
			else {
				this.loadSuggestions('', true, () => {
					if(this.state.suggestions && this.state.suggestions.length > 0) {
						this.setState({
							selectedSuggestionIndex: 0,
							inputValue: this.getValueForSuggestion(this.state.suggestions[0])
						});
					}
				});
			}
		}
		else if(e.key === 'ArrowUp') {
			if(loadingSuggestions) {
				// don't interrupt anything if we're still loading
				return;
			}

			if(suggestions && suggestions.length > 0) {
				let newSelection = Math.max(selectedSuggestionIndex - 1, 0);

				this.setState({
					selectedSuggestionIndex: newSelection,
					inputValue: this.getValueForSuggestion(suggestions[newSelection])
				}, () => {
					this.adjustSuggestionScroll(target);
				});
			}
		}
		else if(isEmpty(e.target.value) && e.key === 'Backspace') {
			e.preventDefault();
			this.deleteLastValue();
		}
	}


	getValueForSuggestion (suggestion) {
		return suggestion.display || suggestion;
	}


	deleteLastValue = () => {
		const {values} = this.state;
		if (values.length > 0) {
			const lastValue = values[values.length - 1];
			this.remove(lastValue);
			this.setState({ inputValue: lastValue.display || lastValue });
		}
	}

	onSuggestionClick = (suggestion) => {
		this.add(suggestion);
		this.clearInput();
	};

	renderSuggestion = (suggestion, index) => {
		return (
			<Suggestion key={this.getValueForSuggestion(suggestion)}
				suggestion={suggestion}
				onClick={this.onSuggestionClick}
				selected={this.state.selectedSuggestionIndex === index}
			/>
		);
	}


	renderSuggestions () {
		const { loadingSuggestions, suggestions } = this.state;

		const style = {
			marginLeft: (this.input && this.input.offsetLeft) + 'px'
		};

		if(loadingSuggestions) {
			return (<div style={style} className="suggestions-container loading">Loading suggestions...</div>);
		}
		else if(suggestions && suggestions.length > 0) {
			return (<div style={style} className="suggestions-container">{suggestions.map(this.renderSuggestion)}</div>);
		}
		else if(suggestions && suggestions.length === 0) {
			return (<div style={style} className="suggestions-container no-matches">No matches found</div>);
		}

		return null;
	}


	render () {

		const {placeholder, disabled, maxTokenLength} = this.props;
		const {values, inputValue} = this.state;

		const classes = cx('token-editor', this.props.className);

		return (
			<div className={classes} onClick={this.focusInput}>
				{!disabled && placeholder && values.length === 0 && inputValue.length === 0 && <span className="placeholder">{placeholder}</span>}
				{values.map(x => <Token key={x.display || x} value={x.display || x} onRemove={disabled ? void 0 : this.remove} />)}
				<input
					disabled={disabled}
					className="token"
					ref={this.attachInputRef}
					onKeyDown={this.onKeyDown}
					onChange={this.onInputChange}
					onBlur={this.onBlur}
					value={inputValue}
					maxLength={maxTokenLength}
				/>
				{this.renderSuggestions()}
			</div>
		);
	}
}
