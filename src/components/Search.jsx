import React, {PropTypes} from 'react';
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

	render () {
		return ( <input {...this.props} ref={this.attachRef}/> );
	}
}



export default class Search extends React.Component {

	static propTypes = {
		disabled: PropTypes.bool,
		onChange: PropTypes.func,
		defaultValue: PropTypes.string,
		buffered: PropTypes.bool
	}


	static defaultProps = {
		buffered: true
	}


	attachRef = x => this.input = x


	clearFilter = () => {
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


	render () {
		const {disabled, buffered, ...props} = this.props;
		const Cmp = buffered ? BufferedInput : Input;
		return (
			<form onSubmit={stop} className={cx('search-component',{disabled})}>
				<i className="icon-search"/>
				<Cmp {...props}
					type="text"
					placeholder="Search"
					disabled={disabled}
					onChange={this.onChange}
					ref={this.attachRef}
					required
					/>
				<input type="reset" onClick={this.clearFilter}/>
			</form>
		);
	}
}
