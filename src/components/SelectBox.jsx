import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import SelectBoxItem from './SelectBoxItem';

export default class extends React.Component {
	static displayName = 'SelectBox';

	static propTypes = {
		options: PropTypes.array.isRequired,
		value: PropTypes.any,
		onChange: PropTypes.func,
		className: PropTypes.string,
		disabled: PropTypes.bool
	};

	state = {
		isOpen: false
	};

	componentWillMount () {
		let {value, options} = this.props;
		this.setSelected(value || options[0].value, true);
	}

	componentWillReceiveProps (nextProps) {
		let {value, options} = nextProps;
		this.setSelected(value || options[0].value, true, nextProps);
	}

	setSelected = (value, silent, props = this.props) => {
		let {options, onChange} = props;
		let selectedOption = value ? options.find(option => option.value === value) : options[0];
		this.setState({
			selectedOption
		});

		if(!silent && onChange) {
			onChange(value);
		}
	};

	onClick = (value) => {
		this.setSelected(value);
		this.close();
	};

	open = () => {
		this.setState({
			isOpen: true
		});
	};

	close = () => {
		this.setState({
			isOpen: false
		});
	};

	toggle = (e) => {
		e.preventDefault();
		e.stopPropagation();
		this.state.isOpen ? this.close() : this.open();
	};

	render () {
		const {
			state: {isOpen, selectedOption},
			props: {disabled, className, options}
		} = this;

		let classes = cx('select-box', className, {'open': isOpen, disabled});

		const optionLabel = (text) => <span className="option-label">{text}</span>;
		// let selectedItem = <li className="selected" onClick={this.toggle}><span className="option-label">{selectedOption.label}</span></li>;

		return (
			<div className={classes} tabIndex="-1">
				{isOpen && <div className="click-mask" onClick={this.toggle} />}
				<div className="menu-label selected" onClick={disabled ? null : this.toggle}>{optionLabel(selectedOption.label)}</div>
				{isOpen && (
					<ul>
						{options.filter(item => item !== selectedOption).map((option, index) =>
							<SelectBoxItem key={index} option={option} onClick={this.onClick} />
						)}
					</ul>
				)}
			</div>
		);

	}
}
