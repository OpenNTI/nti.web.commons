import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Multiple.css';
import Option from './Option';
import {
	getChangedValues,
	getValueForOption,
	optionMatchesTerm,
	multipleKeyDownStateModifier,
} from './utils';

const SCROLL_TO_OPTION = Symbol('Scroll To Option');

const cx = classnames.bind(Styles);

export default class MultipleSelect extends React.Component {
	static propTypes = {
		values: PropTypes.arrayOf(
			PropTypes.oneOfType([PropTypes.string, PropTypes.number])
		),

		className: PropTypes.string,
		optionsClassName: PropTypes.string,
		onChange: PropTypes.func,
		children: PropTypes.node,

		disabled: PropTypes.bool,
	};

	attachInputRef = node => (this.input = node);

	attachFocusedRef = node => {
		const changed = this.focusedOption !== node;

		this.focusedOption = node;

		if (changed) {
			this[SCROLL_TO_OPTION]();
		}
	};

	attachOptionListRef = node => {
		this.optionList = node;

		this[SCROLL_TO_OPTION]();
	};

	state = {
		activeOptions: [],
		selectedOptions: [],
		focusedIndex: -1,
	};

	focus() {
		if (this.input) {
			this.input.focus();
		}
	}

	componentDidMount() {
		this.setupFor(this.props);
	}

	componentDidUpdate(prevProps) {
		const { values: oldValues, children: oldChildren } = prevProps;
		const { values, children } = this.props;

		if (
			oldValues !== values ||
			React.Children.count(oldChildren) !== React.Children.count(children)
		) {
			this.setupFor(this.props, oldValues);
		}
	}

	setupFor(props, oldValues) {
		const { children, values } = props;
		const { focusedIndex } = this.state;
		const changedValuesSet = getChangedValues(values, oldValues);
		const valuesSet = new Set(values);
		const options = React.Children.toArray(children);

		let selectedOptions = [];
		let selectedIndex = -1;

		for (let i = 0; i < options.length; i++) {
			const value = getValueForOption(options[i]);

			if (changedValuesSet.has(value)) {
				selectedIndex = i;
			}

			if (valuesSet.has(value)) {
				selectedOptions.push(options[i]);
			}
		}

		this.setState({
			options,
			activeOptions: options,
			selectedOptions,
			selectedIndex,
			focusedIndex: focusedIndex != null ? focusedIndex : selectedIndex,
		});
	}

	[SCROLL_TO_OPTION]() {
		const { focusedOption, optionList } = this;

		if (!focusedOption || !optionList) {
			return null;
		}

		const listRect = optionList.getBoundingClientRect();
		const optionRect = focusedOption.getBoundingClientRect();

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

	selectOptions(values) {
		const { onChange } = this.props;

		if (onChange) {
			onChange(values);
		}
	}

	toggleOption = value => {
		const { selectedOptions } = this.state;
		const selectedValues = selectedOptions.map(option =>
			getValueForOption(option)
		);
		const selectedSet = new Set(selectedValues);

		if (selectedSet.has(value)) {
			selectedSet.delete(value);
		} else {
			selectedSet.add(value);
		}

		this.selectOptions(Array.from(selectedSet));
		this.focus();
	};

	onInputChange = e => {
		const { value } = e.target;

		const { activeOptions, focusedIndex } = this.state;

		clearTimeout(this.clearInputBufferTimeout);

		let newFocused = focusedIndex;

		for (let i = 0; i < activeOptions.length; i++) {
			const option = activeOptions[i];

			if (optionMatchesTerm(option, value)) {
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

	onInputFocus = () => {
		const { focusedIndex } = this.state;

		this.setState({
			focused: true,
			focusedIndex:
				focusedIndex == null || focusedIndex < 0 ? 0 : focusedIndex,
		});
	};

	onInputBlur = () => {
		this.setState({ focused: false });
	};

	onInputKeyDown = e => {
		const { selectedOptions: oldSelected } = this.state;
		const newState = multipleKeyDownStateModifier(e, this.state);
		const { selectedOptions: newSelected } = newState;

		if (oldSelected !== newSelected) {
			this.selectOptions(
				newSelected.map(selected => getValueForOption(selected))
			);
		}

		this.setState(newState);
	};

	onListClick = () => {
		this.focus();
	};

	onListFocus = () => {
		this.focus();
	};

	render() {
		const { disabled, className, optionsClassName } = this.props;
		const {
			activeOptions,
			selectedOptions,
			focusedIndex,
			focused,
			inputBuffer,
		} = this.state;
		const selectedSet = new Set(selectedOptions);

		return (
			<div
				className={cx('nti-multiple-select-input', className, {
					disabled,
					focused,
				})}
				onClick={this.onListClick}
				onFocus={this.onListFocus}
				ref={this.attachOptionListRef}
			>
				<input
					type="text"
					ref={this.attachInputRef}
					value={inputBuffer}
					onChange={this.onInputChange}
					onFocus={this.onInputFocus}
					onBlur={this.onInputBlur}
					onKeyDown={this.onInputKeyDown}
				/>
				<ul
					className={cx(
						'nti-multiple-select-input-options',
						optionsClassName
					)}
				>
					{activeOptions &&
						activeOptions.map((option, index) => {
							if (option.type !== Option) {
								throw new Error(
									'Child of select must be an option'
								);
							}

							const selected = selectedSet.has(option);
							const isFocused = index === focusedIndex;

							const ref = isFocused
								? this.attachFocusedRef
								: null;

							const optionCmp = React.cloneElement(option, {
								index,
								onClick: this.toggleOption,
								selected,
								focused: isFocused,
							});

							return (
								<li key={index} ref={ref}>
									{optionCmp}
								</li>
							);
						})}
				</ul>
			</div>
		);
	}
}
