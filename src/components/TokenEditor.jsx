import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import isEmpty from 'isempty';
import Logger from 'nti-util-logger';

import Token from './Token';

const logger = Logger.get('common:components:TokenEditor');

const SUGGESTION_BUFFER = 300;

export default class TokenEditor extends React.Component {

	static propTypes = {
		tokens: PropTypes.array,//deprecated... we need to conform to the "value/onChange" api.
		value: PropTypes.array,
		onChange: PropTypes.func,
		onFocus: PropTypes.func,
		className: PropTypes.string,
		preprocessToken: PropTypes.func,
		placeholder: PropTypes.string,
		disabled: PropTypes.bool,
		suggestionProvider: PropTypes.func
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
			suggestions: []
		};
	}


	componentWillMount () {
		this.initState();
	}


	componentWillReceiveProps (nextProps) {
		if (nextProps.value !== this.props.value) {
			this.initState(nextProps);
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
			suggestions: [],
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
		const filtered =  values.filter(x => x !== value);

		if (filtered.length < values.length) {
			this.setState(
				{values: filtered},
				()=> this.onChange()
			);
		}
	}


	clearInput = () => {
		this.setState({ inputValue: '', suggestions: [], loadingSuggestions: false });
	}


	focusInput = () => {
		if (this.input) {
			this.input.focus();
		}
		if (this.props.onFocus) {
			this.props.onFocus();
		}
	}


	onBlur = (/*e*/) => {
		// this.add(e.target.value);
		// this.clearInput();

		this.resetSuggestionState();
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

		if(selectedSuggestionIndex >= suggestions.length) {
			newState.selectedSuggestionIndex = -1;
		}

		if(value === '') {
			newState.suggestions = [];
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
			this.setState({suggestions: []});
		}
		else if(suggestionProvider) {
			this.setState({ loadingSuggestions: true });

			suggestionProvider(value).then((newSuggestions) => {
				this.setState({
					suggestions: newSuggestions,
					loadingSuggestions: false
				}, () => { callback && callback(); });
			});
		}
	}


	onKeyDown = (e) => {
		const { suggestions, selectedSuggestionIndex } = this.state;

		const finishingKeys = ['Enter', 'Tab', ' ', ','];
		if (finishingKeys.indexOf(e.key) > -1) {
			e.stopPropagation();
			e.preventDefault();

			if(suggestions.length > 0 && selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
				this.add(suggestions[selectedSuggestionIndex]);
			}
			else {
				this.add(e.target.value);
			}
			this.clearInput();
		}
		else if(e.key === 'ArrowDown') {
			if(suggestions && suggestions.length > 0) {
				let newSelection = Math.min(selectedSuggestionIndex + 1, suggestions.length - 1);

				this.setState({selectedSuggestionIndex: newSelection, inputValue: suggestions[newSelection]});
			}
			else {
				this.loadSuggestions('', true, () => {
					if(this.state.suggestions && this.state.suggestions.length > 0) {
						this.setState({
							selectedSuggestionIndex: 0,
							inputValue: this.state.suggestions[0]
						});
					}
				});
			}
		}
		else if(e.key === 'ArrowUp') {
			if(suggestions && suggestions.length > 0) {
				let newSelection = Math.max(selectedSuggestionIndex - 1, 0);

				this.setState({selectedSuggestionIndex: newSelection, inputValue: suggestions[newSelection]});
			}
		}
		else if(isEmpty(e.target.value) && e.key === 'Backspace') {
			e.preventDefault();
			this.deleteLastValue();
		}
	}


	deleteLastValue = () => {
		const {values} = this.state;
		if (values.length > 0) {
			const lastValue = values[values.length - 1];
			this.remove(lastValue);
			this.setState({ inputValue: lastValue });
		}
	}

	renderSuggestion = (suggestion, index) => {
		const { selectedSuggestionIndex } = this.state;

		const suggestionClick = () => {
			this.add(suggestion);
			this.clearInput();
		};

		const classes = cx('suggestion', selectedSuggestionIndex === index ? 'selected' : '');

		return (<div className={classes} key={suggestion} onClick={suggestionClick}>{suggestion}</div>);
	}

	renderSuggestions () {
		const { loadingSuggestions, suggestions } = this.state;

		const style = {
			marginLeft: (this.input && this.input.offsetLeft) + 'px'
		};

		if(loadingSuggestions) {
			return (<div style={style}>Loading suggestions...</div>);
		}
		else if(suggestions && suggestions.length > 0) {
			return (<div style={style} className="suggestions-container">{suggestions.map(this.renderSuggestion)}</div>);
		}

		return null;
	}


	render () {

		const {placeholder, disabled} = this.props;
		const {values, inputValue} = this.state;

		const classes = cx('token-editor', this.props.className);

		return (
			<div className={classes} onClick={this.focusInput}>
				{!disabled && placeholder && values.length === 0 && inputValue.length === 0 && <span className="placeholder">{placeholder}</span>}
				{values.map(x => <Token key={x} value={x} onRemove={disabled ? void 0 : this.remove} />)}
				<input
					disabled={disabled}
					className="token"
					ref={this.attachInputRef}
					onKeyDown={this.onKeyDown}
					onChange={this.onInputChange}
					onBlur={this.onBlur}
					value={inputValue}
				/>
				{this.renderSuggestions()}
			</div>
		);
	}

}
