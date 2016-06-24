import React from 'react';
import BufferedInput from './BufferedInput';

const stop = e => e.preventDefault();

export default class Search extends React.Component {

	static propTypes = {
		onChange: React.PropTypes.func,
		defaultValue: React.PropTypes.string
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
		return (
			<form onSubmit={stop} className="search-component">
				<i className="icon-search"/>
				<BufferedInput type="text"
					defaultValue={this.props.defaultValue}
					onChange={this.onChange}
					ref={this.attachRef}
					required
					/>
				<input type="reset" onClick={this.clearFilter}/>
			</form>
		);
	}
}
