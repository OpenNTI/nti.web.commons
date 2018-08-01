import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import BufferedInput from './BufferedInput';

const stop = e => e.preventDefault();


class Input extends React.Component {

	attachRef = x => this.input = x

	clear () {
		const {input, props: {onChange}} = this; //eslint-disable-line
		input.value = '';
		if (onChange) {
			onChange({
				target: input,
				type: 'change',
				persist () {},
				preventDefault () {},
				stopPropagation () {}
			});
		}
	}

	focus () {
		if (this.input) {
			this.input.focus();
		}
	}

	render () {
		return ( <input {...this.props} ref={this.attachRef}/> );
	}
}



export default class Search extends React.Component {

	static propTypes = {
		className: PropTypes.string,
		disabled: PropTypes.bool,
		onChange: PropTypes.func,
		onBlur: PropTypes.func,
		onFocus: PropTypes.func,
		defaultValue: PropTypes.string,
		buffered: PropTypes.bool,
		placeholder: PropTypes.string
	}


	static defaultProps = {
		buffered: true
	}


	state = {}


	attachRef = x => this.input = x


	clearFilter = (e) => {
		e.stopPropagation();
		e.preventDefault();
		const {input} = this;
		input.clear();
		input.focus();
	}


	onChange = (event) => {
		const {onChange} = this.props;
		if (onChange) {
			onChange(event.target.value);
		}
	}


	onFocus = (e) => {
		const {onFocus} = this.props;
		if (onFocus) { onFocus(e); }
		this.setState({focused: true});
	}


	onBlur = (e) => {
		const {onBlur} = this.props;
		if (onBlur) { onBlur(e); }
		this.setState({focused: false});
	}


	render () {
		const {props: {disabled, buffered, className, placeholder = 'Search', ...props}, state: {focused}} = this;
		const Cmp = buffered ? BufferedInput : Input;
		return (
			<form onSubmit={stop} className={cx('search-component', className, {focused, disabled})} noValidate>
				<i className="icon-search"/>
				<Cmp {...props}
					type="text"
					placeholder={placeholder}
					disabled={disabled}
					onChange={this.onChange}
					onBlur={this.onBlur}
					onFocus={this.onFocus}
					ref={this.attachRef}
					required
				/>
				<input type="reset" onClick={this.clearFilter}/>
			</form>
		);
	}
}
