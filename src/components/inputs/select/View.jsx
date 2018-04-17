import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Text from '../Text';

import Option from './Option';

export default class SelectInput extends React.Component {
	static Option = Option

	static propTypes = {
		value: PropTypes.string,
		className: PropTypes.string,
		onChange: PropTypes.func,
		children: PropTypes.node,
		placeholder: PropTypes.string,

		disabled: PropTypes.bool,

		searchable: PropTypes.bool
	}


	attachLabelInputRef = x => this.input = x


	state = {
		isOpen: false,
		selectedIndex: -1,
		activeOptions: []
	}


	componentDidMount () {
		this.setupFor(this.props);
	}


	componentDidUpdate (prevProps) {
		const {value:oldValue} = prevProps;
		const {value:newValue} = this.props;

		if (oldValue !== newValue) {
			this.setupFor(this.props);
		}
	}


	setupFor (props) {
		debugger;
		const {children, value} = this.props;
		const options = React.Children.toArray(children);

		let selectedIndex = -1;

		for (let i = 0; i < options.length; i++) {
			const option = options[i];

			if (option.props.value === value) {
				selectedIndex = i;
				break;
			}
		}

		this.setState({
			options,
			activeOptions: options,
			selectedIndex
		});
	}


	focus () {
		if (this.input) {
			this.input.focus();
		}
	}


	onOptionClick = (value) => {
		const {onChange} = this.props;

		if (onChange) {
			onChange(value);
		}

		this.focus();
	}


	onLabelClick = () => {
		this.focus();
	}


	onInputFocus = () => {
		clearTimeout(this.closeMenuTimeout);
		this.setState({isOpen: true});
	}


	onInputBlur = () => {
		this.closeMenuTimeout = setTimeout(() => {
			this.setState({isOpen: false});
		}, 300);
	}


	onInputKeyDown = () => {

	}


	onInputKeyPress = () => {

	}


	render () {
		const {disabled, className, searchable} = this.props;
		const {isOpen, activeOptions, selectedIndex} = this.state;

		return (
			<div
				className={cx('nti-select-input', className, {open: isOpen, disabled, searchable})}
				role="listbox"
			>
				{this.renderLabel()}
				<ul className="options">
					{activeOptions && activeOptions.map((option, index) => {
						if (option.type !== Option) { throw new Error('Children of select must be an option'); }

						return React.cloneElement(option, {
							index,
							onClick: this.onOptionClick,
							selected: selectedIndex === index
						});
					})}
				</ul>
			</div>
		);
	}


	renderLabel () {
		const {searchable, placeholder, value} = this.props;
		const {activeOptions, selectedIndex} = this.state;
		const selectedOption = activeOptions[selectedIndex];

		return (
			<div className={cx('select-label', {searchable})}>
				<Text
					ref={this.attachLabelInputRef}
					value={value}
					placeholder={placeholder}
					readOnly={!searchable}
					onFocus={this.onInputFocus}
					onBlur={this.onInputBlur}
					onKeyDown={this.onInput}
				/>
				<div className="selected-option" onClick={this.onLabelClick}>
					{selectedOption && React.cloneElement(selectedOption)}
				</div>
			</div>
		);
	}
}
