import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Text from '../Text';

import Option from './Option';
import {keyDownStateModifier, getValueForOption} from './utils';

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
		focusedIndex: -1,
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
		const {children, value} = this.props;
		const options = React.Children.toArray(children);

		let selectedIndex = -1;

		for (let i = 0; i < options.length; i++) {
			const option = options[i];

			if (getValueForOption(option) === value) {
				selectedIndex = i;
				break;
			}
		}

		this.setState({
			options,
			activeOptions: options,
			selectedIndex,
			focusedIndex: selectedIndex
		});
	}


	focus () {
		if (this.input) {
			this.input.focus();
		}
	}


	openMenu () {
		const {isOpen} = this.state;

		clearTimeout(this.closeMenuTimeout);

		if (!isOpen) {
			this.setState({
				isOpen: true
			});
		}
	}


	closeMenu () {
		this.closeMenuTimeout = setTimeout(() => {
			const {isOpen, selectedIndex} = this.state;

			if (isOpen) {
				this.setState({
					isOpen: false,
					focusedIndex: selectedIndex
				});
			}
		}, 300);
	}


	selectOption = (value) => {
		const {onChange} = this.props;

		if (onChange) {
			onChange(value);
		}

		this.focus();
	}


	onLabelClick = () => {
		this.focus();
		this.openMenu();
	}


	onInputFocus = () => {
		this.setState({
			focused: true
		});
	}


	onInputBlur = () => {
		this.setState({
			focused: false
		});
		this.closeMenu();
	}


	onInputKeyDown = (e) => {
		const {selectedIndex:oldSelected} = this.state;
		const newState = keyDownStateModifier(e, this.state);
		const {selectedIndex:newSelected, activeOptions} = newState;

		if (oldSelected !== newSelected) {
			this.selectOption(getValueForOption(activeOptions[newSelected]));
		}

		this.setState(newState);
	}


	render () {
		const {disabled, className, searchable} = this.props;
		const {isOpen, activeOptions, selectedIndex, focusedIndex, focused} = this.state;

		return (
			<div
				className={cx('nti-select-input', className, {open: isOpen, disabled, searchable, focused})}
				role="listbox"
			>
				{this.renderLabel()}
				<ul className="options">
					{activeOptions && activeOptions.map((option, index) => {
						if (option.type !== Option) { throw new Error('Children of select must be an option'); }

						return React.cloneElement(option, {
							index,
							onClick: this.selectOption,
							selected: selectedIndex === index,
							focused: focusedIndex === index
						});
					})}
				</ul>
			</div>
		);
	}


	renderLabel () {
		const {searchable, placeholder, value} = this.props;
		const {activeOptions, focusedIndex} = this.state;
		const selectedOption = activeOptions[focusedIndex];

		return (
			<div className={cx('select-label', {searchable})}>
				<Text
					ref={this.attachLabelInputRef}
					value={value}
					placeholder={placeholder}
					readOnly={!searchable}
					onFocus={this.onInputFocus}
					onBlur={this.onInputBlur}
					onKeyDown={this.onInputKeyDown}
				/>
				<div className="selected-option" onClick={this.onLabelClick}>
					{selectedOption && React.cloneElement(selectedOption, {display: true})}
				</div>
			</div>
		);
	}
}
