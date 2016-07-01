import React, {PropTypes} from 'react';
import cx from 'classnames';
import BufferedInput from './BufferedInput';

const stop = e => e.preventDefault();

export default class Search extends React.Component {

	static propTypes = {
		disabled: PropTypes.bool,
		onChange: PropTypes.func,
		defaultValue: PropTypes.string
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
		const {disabled, defaultValue} = this.props;
		return (
			<form onSubmit={stop} className={cx('search-component',{disabled})}>
				<i className="icon-search"/>
				<BufferedInput type="text"
					placeholder="Search"
					disabled={disabled}
					defaultValue={defaultValue}
					onChange={this.onChange}
					ref={this.attachRef}
					required
					/>
				<input type="reset" onClick={this.clearFilter}/>
			</form>
		);
	}
}
