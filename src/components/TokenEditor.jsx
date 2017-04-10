import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import isEmpty from 'isempty';
import Logger from 'nti-util-logger';

import Token from './Token';

const logger = Logger.get('common:components:TokenEditor');

export default class TokenEditor extends React.Component {

	static propTypes = {
		tokens: PropTypes.array,//deprecated... we need to conform to the "value/onChange" api.
		value: PropTypes.array,
		onChange: PropTypes.func,
		onFocus: PropTypes.func,
		className: PropTypes.string,
		preprocessToken: PropTypes.func,
		placeholder: PropTypes.string,
		disabled: PropTypes.bool
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


	add = (value) => {
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
		this.setState({ inputValue: '' });
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
	}


	onChange = () => {
		const {props: {onChange}, state: {values}} = this;

		if (onChange) {
			onChange(values);
		}
	}


	onInputChange = (e) => {
		this.setState({
			inputValue: e.target.value
		});
	}


	onKeyDown = (e) => {
		const finishingKeys = ['Enter', 'Tab', ' ', ','];
		if (finishingKeys.indexOf(e.key) > -1) {
			e.stopPropagation();
			e.preventDefault();
			this.add(e.target.value);
			this.clearInput();
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
			</div>
		);
	}

}
