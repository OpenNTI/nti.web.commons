import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

import Text from '../Text';

import Option from './Option';
import {
	keyDownStateModifier,
	getValueForOption,
	optionMatchesTerm
} from './utils';

const t = scoped('common.components.inputs.select.View', {
	emptySearch: 'No Results Found'
});

export default class SelectInput extends React.Component {
	static Option = Option

	static propTypes = {
		value: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		className: PropTypes.string,
		onChange: PropTypes.func,
		children: PropTypes.node,
		placeholder: PropTypes.string,

		disabled: PropTypes.bool,

		searchable: PropTypes.bool,
		applySearchTerm: PropTypes.func,
		allowOtherValues: PropTypes.bool,


		onFocus: PropTypes.func,
		onBlur: PropTypes.func
	}


	attachLabelInputRef = x => this.input = x


	state = {
		isOpen: false,
		selectedIndex: -1,
		focusedIndex: -1,
		activeOptions: [],
		inputBuffer: '',
		inputValue: ''
	}


	componentDidMount () {
		this.setupFor(this.props);
	}


	componentDidUpdate (prevProps) {
		const {value: oldValue, children: oldChildren} = prevProps;
		const {value: newValue, children: newChildren} = this.props;

		if (oldValue !== newValue || oldChildren !== newChildren) {
			this.setupFor(this.props);
		}
	}


	setupFor (props) {
		const {children, value} = this.props;
		const {focusedIndex} = this.state;
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
			focusedIndex: focusedIndex != null ? focusedIndex : selectedIndex
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
		this.closeMenu();

		this.setState({
			inputBuffer: '',
			inputValue: ''
		});
	}


	onLabelClick = () => {
		this.focus();
		this.openMenu();
	}


	onDownArrowClick = () => {
		this.focus();
		this.openMenu();
	}


	onInputFocus = () => {
		const {searchable, onFocus} = this.props;

		this.setState({
			focused: true
		});

		if (searchable) {
			this.openMenu();
		}

		if (onFocus) {
			onFocus();
		}
	}


	onInputBlur = () => {
		const {onBlur} = this.props;

		this.setState({
			focused: false
		});
		this.closeMenu();

		if (onBlur) {
			onBlur();
		}
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


	onInputChange = (value) => {
		const {activeOptions, isOpen, focusedIndex} = this.state;

		clearTimeout(this.clearInputBufferTimeout);

		let newFocused = focusedIndex;

		for (let i = 0; i < activeOptions.length; i++) {
			const option = activeOptions[i];

			if (optionMatchesTerm(option, value)) {
				if (!isOpen) {
					this.selectOption(getValueForOption(activeOptions[i]));
				}

				newFocused = i;

				break;
			}
		}

		this.setState({
			inputBuffer: value,
			focusedIndex: newFocused
		}, () => {
			this.clearInputBufferTimeout = setTimeout(() => {
				this.setState({
					inputBuffer: ''
				});
			}, 250);
		});

	}


	onSearchableInputChange = (value) => {
		const {options, selectedIndex} = this.state;
		const selectedOption = options[selectedIndex];

		if (selectedOption && !optionMatchesTerm(selectedOption, value)) {
			this.selectOption(null);
			value = value.charAt(value.length - 1);
		}

		const newActive = options.reduce((acc, option) => {
			if (optionMatchesTerm(option, value)) {
				acc.push(option);
			}

			return acc;
		}, []);

		this.setState({
			isOpen: true,
			inputValue: value,
			activeOptions: newActive,
			focusedIndex: 0
		});
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

						const optionCmp = React.cloneElement(option, {
							index,
							onClick: this.selectOption,
							selected: selectedIndex === index,
							focused: focusedIndex === index
						});

						return (
							<li key={index}>
								{optionCmp}
							</li>
						);
					})}
					{searchable && activeOptions && activeOptions.length === 0 && (
						<li>
							<Option display>
								{t('emptySearch')}
							</Option>
						</li>
					)}
				</ul>
			</div>
		);
	}


	renderLabel () {
		const {searchable, placeholder} = this.props;
		const {activeOptions, selectedIndex, inputValue, focused} = this.state;
		const selectedOption = activeOptions[selectedIndex];

		return (
			<div className={cx('select-label', {searchable, 'has-selected': selectedOption, focused})}>
				<Text
					ref={this.attachLabelInputRef}
					value={inputValue}
					placeholder={placeholder}
					onChange={searchable ? this.onSearchableInputChange : this.onInputChange}
					onFocus={this.onInputFocus}
					onBlur={this.onInputBlur}
					onKeyDown={this.onInputKeyDown}
				/>
				<div className="placeholder">
					{placeholder || ''}
				</div>
				<div className="selected-option" onClick={this.onLabelClick}>
					{selectedOption && React.cloneElement(selectedOption, {display: true})}
				</div>
				<i className="icon-chevron-down" onClick={this.onDownArrowClick} />
			</div>
		);
	}
}
