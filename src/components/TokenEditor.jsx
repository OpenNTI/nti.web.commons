import React from 'react';
import isEmpty from 'isempty';
import cx from 'classnames';

import Token from './Token';

export default class TokenEditor extends React.Component {

	static propTypes = {
		tokens: React.PropTypes.array,
		onChange: React.PropTypes.func,
		onFocus: React.PropTypes.func,
		className: React.PropTypes.string,
		preprocessToken: React.PropTypes.func,
		placeholder: React.PropTypes.string
	}

	state = {inputValue: ''}

	get value () {
		return [...this.state.values];
	}


	componentWillMount () {
		this.setUp();
	}


	setUp (props = this.props) {
		this.setState({
			values: [... new Set(props.tokens)]//dedupe
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

		const {placeholder} = this.props;
		const {values, inputValue} = this.state;

		const classes = cx('token-editor', this.props.className);

		return (
			<div className={classes} onClick={this.focusInput}>
				{placeholder && values.length === 0 && inputValue.length === 0 && <span className="placeholder">{placeholder}</span>}
				{values.map(x => <Token key={x} value={x} onRemove={this.remove} />)}
				<input
					className="token"
					ref={x => this.input = x}
					onKeyDown={this.onKeyDown}
					onChange={this.onInputChange}
					onBlur={this.onBlur}
					value={inputValue}
				/>
			</div>
		);
	}

}
