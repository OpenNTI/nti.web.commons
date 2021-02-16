import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { scoped } from '@nti/lib-locale';
import { getScrollParent, canScroll } from '@nti/lib-dom';

import { Triggered } from '../../../flyout';
import Text from '../Text';

import Multiple from './Mutilple';
import Option from './Option';
import {
	isSameOptions,
	keyDownStateModifier,
	getValueForOption,
	optionMatchesTerm,
} from './utils';

const t = scoped('common.components.inputs.select.View', {
	emptySearch: 'No Results Found',
});

const SCROLL_TO_OPTION = Symbol('scroll to option');
const SCROLL_LIST_TO_OPTION = Symbol('scroll list to option');

export default class SelectInput extends React.Component {
	static Option = Option;
	static Multiple = Multiple;

	static propTypes = {
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		className: PropTypes.string,
		optionsClassName: PropTypes.string,
		onChange: PropTypes.func,
		children: PropTypes.node,
		placeholder: PropTypes.string,

		disabled: PropTypes.bool,

		searchable: PropTypes.bool,
		maintainOnSelect: PropTypes.bool,
		applySearchTerm: PropTypes.func,
		allowOtherValues: PropTypes.bool,

		onFocus: PropTypes.func,
		onBlur: PropTypes.func,
	};

	attachFlyoutRef = x => (this.flyout = x);
	attachLabelInputRef = x => (this.input = x);
	attachOptionRef = () => {};

	attachOptionListRef = list => {
		this.optionList = list;

		this[SCROLL_TO_OPTION]();
	};

	attachSelectedRef = selected => {
		const changed = this.selectedOption !== selected;

		this.selectedOption = selected;

		if (changed) {
			this[SCROLL_TO_OPTION]();
		}
	};

	attachFocusedRef = focused => {
		const changed = this.focusedOption !== focused;

		this.focusedOption = focused;

		if (changed) {
			this[SCROLL_TO_OPTION]();
		}
	};

	state = {
		isOpen: false,
		selectedIndex: -1,
		focusedIndex: -1,
		activeOptions: [],
		inputBuffer: '',
		inputValue: '',
	};

	componentDidMount() {
		this.setupFor(this.props);
	}

	componentDidUpdate(prevProps) {
		const { value: oldValue, children: oldChildren } = prevProps;
		const { value: newValue, children: newChildren } = this.props;

		const same = isSameOptions(
			React.Children.toArray(newChildren),
			React.Children.toArray(oldChildren)
		);

		if (oldValue !== newValue || !same) {
			this.setupFor(this.props);
		}
	}

	setupFor(props) {
		const { children, value } = this.props;
		const { focusedIndex, inputValue } = this.state;
		const options = React.Children.toArray(children);
		const activeOptions = inputValue
			? options.filter(option => optionMatchesTerm(option, inputValue))
			: options;

		let selectedOption = null;
		let selectedIndex = -1;

		for (let i = 0; i < activeOptions.length; i++) {
			const option = activeOptions[i];

			if (getValueForOption(option) === value) {
				selectedOption = option;
				selectedIndex = i;
				break;
			}
		}

		this.setState({
			options,
			activeOptions,
			selectedOption,
			focusedIndex: focusedIndex != null ? focusedIndex : selectedIndex,
		});
	}

	focus() {
		if (this.input) {
			this.input.focus();
		}
	}

	realign() {
		if (this.flyout) {
			this.flyout.realign();
		}
	}

	[SCROLL_TO_OPTION]() {
		const option = this.focusedOption || this.selectedOption;
		const { optionList } = this;

		if (!option || !optionList) {
			return null;
		}

		this[SCROLL_LIST_TO_OPTION](optionList, option);
	}

	[SCROLL_LIST_TO_OPTION](optionList, option) {
		const scroller = canScroll(optionList)
			? optionList
			: getScrollParent(optionList);

		const scrollRect = scroller.getBoundingClientRect();
		const optionRect = option.getBoundingClientRect();

		const listHeight = scroller.clientHeight;
		const top = optionRect.top - scrollRect.top;
		const bottom = top + optionRect.height;

		let newTop = scroller.scrollTop;

		if (bottom > listHeight) {
			newTop = bottom - listHeight + newTop;
		} else if (top < 0) {
			newTop = newTop + top;
		}

		scroller.scrollTop = newTop;
	}

	openMenu() {
		const { isOpen } = this.state;

		clearTimeout(this.closeMenuTimeout);

		if (!isOpen) {
			this.setState({
				isOpen: true,
			});
		}
	}

	closeMenu() {
		this.closeMenuTimeout = setTimeout(() => {
			const { isOpen, selectedOption, activeOptions } = this.state;

			if (isOpen) {
				this.setState({
					isOpen: false,
					focusedIndex: activeOptions.indexOf(selectedOption),
				});
			}
		}, 300);
	}

	selectOption = value => {
		const { onChange, maintainOnSelect } = this.props;

		if (onChange) {
			onChange(value);
		}

		if (maintainOnSelect) {
			this.focus();
			return;
		}
		// this.focus();
		this.closeMenu();

		this.setState({
			inputBuffer: '',
			inputValue: '',
		});
	};

	onLabelClick = () => {
		this.focus();
		this.openMenu();
	};

	onDownArrowClick = e => {
		e.stopPropagation();
		e.preventDefault();

		const { isOpen } = this.state;

		if (isOpen) {
			this.closeMenu();
		} else {
			this.focus();
			this.openMenu();
		}
	};

	onInputFocus = () => {
		const { onFocus } = this.props;

		this.setState({
			focused: true,
		});

		this.openMenu();

		if (onFocus) {
			onFocus();
		}
	};

	onInputBlur = () => {
		const { onBlur } = this.props;

		this.setState({
			focused: false,
		});
		this.closeMenu();

		if (onBlur) {
			onBlur();
		}
	};

	onInputKeyDown = e => {
		const { maintainOnSelect } = this.props;
		const { selectedOption: oldSelected } = this.state;
		const newState = keyDownStateModifier(e, this.state);
		const { selectedOption: newSelected } = newState;

		if (oldSelected !== newSelected) {
			this.selectOption(getValueForOption(newSelected));
		}

		if (maintainOnSelect) {
			newState.isOpen = this.state.isOpen;
			delete newState.selectedOption;
		}

		this.setState(newState);
	};

	onInputChange = value => {
		const { activeOptions, isOpen, focusedIndex } = this.state;

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

		this.setState(
			{
				inputBuffer: value,
				focusedIndex: newFocused,
			},
			() => {
				this.clearInputBufferTimeout = setTimeout(() => {
					this.setState({
						inputBuffer: '',
					});
				}, 250);
			}
		);
	};

	onSearchableInputChange = value => {
		const { options } = this.state;
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
			focusedIndex: 0,
		});
	};

	render() {
		const {
			disabled,
			className,
			searchable,
			optionsClassName,
		} = this.props;
		const {
			isOpen,
			activeOptions,
			selectedOption,
			focusedIndex,
			focused,
		} = this.state;

		return (
			<div
				className={cx('nti-select-input', className, {
					open: isOpen,
					disabled,
					searchable,
					focused,
				})}
				role="listbox"
			>
				<Triggered
					constrain
					ref={this.attachFlyoutRef}
					trigger={this.renderLabel()}
					verticalAlign={Triggered.ALIGNMENTS.BOTTOM}
					horizontalAlign={Triggered.ALIGNMENTS.LEFT_OR_RIGHT}
					sizing={Triggered.SIZES.MATCH_SIDE}
					open={isOpen}
					focusOnOpen={false}
				>
					<ul
						className={cx(
							'nti-select-input-options',
							optionsClassName
						)}
						ref={this.attachOptionListRef}
					>
						{activeOptions &&
							activeOptions.map((option, index) => {
								if (option.type !== Option) {
									throw new Error(
										'Children of select must be an option'
									);
								}

								const selected = selectedOption === option;
								const isFocused = focusedIndex === index;

								const ref = selected
									? this.attachSelectedRef
									: isFocused
									? this.attachFocusedRef
									: this.attachOptionRef;

								const optionCmp = React.cloneElement(option, {
									index,
									onClick: this.selectOption,
									selected,
									focused: isFocused,
								});

								return (
									<li key={index} ref={ref}>
										{optionCmp}
									</li>
								);
							})}
						{searchable &&
							activeOptions &&
							activeOptions.length === 0 && (
								<li>
									<Option display>{t('emptySearch')}</Option>
								</li>
							)}
					</ul>
				</Triggered>
			</div>
		);
	}

	renderLabel() {
		const { searchable, placeholder } = this.props;
		const { selectedOption, inputValue, inputBuffer, focused } = this.state;

		return (
			<div
				className={cx('select-label', {
					searchable,
					'has-selected': selectedOption,
					focused,
				})}
			>
				<Text
					ref={this.attachLabelInputRef}
					value={searchable ? inputValue : inputBuffer}
					placeholder={placeholder}
					onChange={
						searchable
							? this.onSearchableInputChange
							: this.onInputChange
					}
					onFocus={this.onInputFocus}
					onBlur={this.onInputBlur}
					onKeyDown={this.onInputKeyDown}
				/>
				<div className="placeholder">{placeholder || ''}</div>
				<div className="selected-option" onClick={this.onLabelClick}>
					{selectedOption &&
						React.cloneElement(selectedOption, { display: true })}
				</div>
				<div className="chevron-indicator">
					<i
						className="icon-chevron-down"
						onClick={this.onDownArrowClick}
					/>
				</div>
			</div>
		);
	}
}
