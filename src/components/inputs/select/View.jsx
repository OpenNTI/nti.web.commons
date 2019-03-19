import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

import {Triggered} from '../../../flyout';
import Text from '../Text';

import Multiple from './Mutilple';
import Option from './Option';
import {
	keyDownStateModifier,
	getValueForOption,
	optionMatchesTerm
} from './utils';

const t = scoped('common.components.inputs.select.View', {
	emptySearch: 'No Results Found'
});

const SCROLL_TO_OPTION = Symbol('scroll to option');
const SCROLL_LIST_TO_OPTION = Symbol('scroll list to option');
const SCROLL_WINDOW_TO_OPTION = Symbol('scroll window to option');

export default class SelectInput extends React.Component {
	static Option = Option
	static Multiple = Multiple

	static propTypes = {
		value: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		className: PropTypes.string,
		optionsClassName: PropTypes.string,
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
	attachOptionRef = () => {}

	attachOptionListRef = (list) => {
		this.optionList = list;

		this[SCROLL_TO_OPTION]();
	}

	attachSelectedRef = (selected) => {
		const changed = this.selectedOption !== selected;

		this.selectedOption = selected;

		if (changed) {
			this[SCROLL_TO_OPTION]();
		}
	}


	attachFocusedRef = (focused) => {
		const changed = this.focusedOption !== focused;

		this.focusedOption = focused;

		if (changed) {
			this[SCROLL_TO_OPTION]();
		}
	}


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

		if (oldValue !== newValue || React.Children.count(oldChildren) !== React.Children.count(newChildren)) {
			this.setupFor(this.props);
		}
	}


	setupFor (props) {
		const {children, value} = this.props;
		const {focusedIndex} = this.state;
		const options = React.Children.toArray(children);

		let selectedOption = null;
		let selectedIndex = -1;

		for (let i = 0; i < options.length; i++) {
			const option = options[i];

			if (getValueForOption(option) === value) {
				selectedOption = option;
				selectedIndex = i;
				break;
			}
		}

		this.setState({
			options,
			activeOptions: options,
			selectedOption,
			focusedIndex: focusedIndex != null ? focusedIndex : selectedIndex
		});
	}


	focus () {
		if (this.input) {
			this.input.focus();
		}
	}


	[SCROLL_TO_OPTION] () {
		const option = this.focusedOption || this.selectedOption;
		const {optionList} = this;

		if (!option || !optionList) { return null; }


		if (optionList.clientHeight < optionList.scrollHeight) {
			this[SCROLL_LIST_TO_OPTION](optionList, option);
		} else {
			this[SCROLL_WINDOW_TO_OPTION](option);
		}
	}


	[SCROLL_LIST_TO_OPTION] (optionList, option) {
		const listRect = optionList.getBoundingClientRect();
		const optionRect = option.getBoundingClientRect();

		const listHeight = optionList.clientHeight;
		const top = optionRect.top - listRect.top;
		const bottom = top + optionRect.height;

		let newTop = optionList.scrollTop;

		if (bottom > listHeight) {
			newTop = bottom - listHeight + newTop;
		} else if (top < 0) {
			newTop = newTop + top;
		}

		optionList.scrollTop = newTop;
	}


	[SCROLL_WINDOW_TO_OPTION] (option) {
		//TODO: fill this out
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
			const {isOpen, selectedOption, activeOptions} = this.state;

			if (isOpen) {
				this.setState({
					isOpen: false,
					focusedIndex: activeOptions.indexOf(selectedOption)
				});
			}
		}, 300);
	}


	selectOption = (value) => {
		const {onChange} = this.props;

		if (onChange) {
			onChange(value);
		}

		// this.focus();
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
		const {onFocus} = this.props;

		this.setState({
			focused: true
		});

		this.openMenu();

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
		const {selectedOption:oldSelected} = this.state;
		const newState = keyDownStateModifier(e, this.state);
		const {selectedOption:newSelected} = newState;

		if (oldSelected !== newSelected) {
			this.selectOption(getValueForOption(newSelected));
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
		const {options} = this.state;
		// const selectedOption = options[selectedIndex];

		// if (selectedOption && !optionMatchesTerm(selectedOption, value)) {
		// 	this.selectOption(null);
		// 	value = value.charAt(value.length - 1);
		// }

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
		const {disabled, className, searchable, optionsClassName} = this.props;
		const {isOpen, activeOptions, selectedOption, focusedIndex, focused} = this.state;

		return (
			<div
				className={cx('nti-select-input', className, {open: isOpen, disabled, searchable, focused})}
				role="listbox"
			>
				<Triggered
					constrain
					trigger={this.renderLabel()}
					verticalAlign={Triggered.ALIGNMENTS.BOTTOM}
					horizontalAlign={Triggered.ALIGNMENTS.LEFT_OR_RIGHT}
					sizing={Triggered.SIZES.MATCH_SIDE}
					open={isOpen}
				>
					<ul className={cx('nti-select-input-options', optionsClassName)} ref={this.attachOptionListRef}>
						{activeOptions && activeOptions.map((option, index) => {
							if (option.type !== Option) { throw new Error('Children of select must be an option'); }

							const selected = selectedOption === option;
							const isFocused = focusedIndex === index;

							const ref = selected ?
								this.attachSelectedRef :
								isFocused ?
									this.attachFocusedRef :
									this.attachOptionRef;

							const optionCmp = React.cloneElement(option, {
								index,
								onClick: this.selectOption,
								selected,
								focused: isFocused
							});

							return (
								<li key={index} ref={ref}>
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
				</Triggered>
			</div>
		);
	}


	renderLabel () {
		const {searchable, placeholder} = this.props;
		const {selectedOption, inputValue, focused} = this.state;

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
