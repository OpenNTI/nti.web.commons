import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { scoped } from '@nti/lib-locale';

import { getChangedValues, getValueForOption } from '../select/utils';
import Option from '../select/Option';
import Select from '../select';

import Styles from './View.css';

const cx = classnames.bind(Styles);

const t = scoped('common.components.inputs.multi-select.View', {
	searchPlaceholder: 'Select...',
});

const childCount = children => React.Children.count(children);

export default class NTIMultiSelectInput extends React.Component {
	static Option = Option;

	static propTypes = {
		className: PropTypes.string,
		values: PropTypes.arrayOf(
			PropTypes.oneOfType([PropTypes.string, PropTypes.number])
		),
		searchPlaceholder: PropTypes.string,
		placeholder: PropTypes.string,
		onChange: PropTypes.func,
		children: PropTypes.node,

		optionsClassName: PropTypes.string,
		onFocus: PropTypes.func,
		onBlur: PropTypes.func,
	};

	attachSelectRef = node => (this.select = node);

	state = {
		activeOptions: [],
	};

	componentDidMount() {
		this.setup(this.props);
	}

	componentDidUpdate(prevProps) {
		const { children, values } = this.props;
		const { children: prevChildren, values: prevValues } = prevProps;

		if (
			values !== prevValues ||
			childCount(children) !== childCount(prevChildren)
		) {
			this.setup(this.props, prevValues);
		}
	}

	setup(props, oldValues) {
		const { children, values } = props;
		const changedValuesSet = getChangedValues(values, oldValues);
		const valuesSet = new Set(values);
		const options = React.Children.toArray(children);

		let selectedValue = null;
		let selectedOptions = [];
		let activeOptions = [];

		for (let option of options) {
			const value = getValueForOption(option);

			if (changedValuesSet.has(value)) {
				selectedValue = value;
			}

			if (valuesSet.has(value)) {
				selectedOptions.push(option);
			}

			activeOptions.push(option);
		}

		selectedOptions.sort((a, b) => {
			const aVal = getValueForOption(a);
			const bVal = getValueForOption(b);

			const aIndex = values.indexOf(aVal);
			const bIndex = values.indexOf(bVal);

			return aIndex - bIndex;
		});

		this.setState(
			{
				selectedValue,
				selectedOptions,
				activeOptions,
			},
			() => {
				if (this.select) {
					this.select.realign();
				}
			}
		);
	}

	onChange(values) {
		const { onChange } = this.props;

		if (onChange) {
			onChange(values);
		}
	}

	removeSelected = (value, e) => {
		e.stopPropagation();
		e.preventDefault();

		const { values } = this.props;

		this.onChange(values.filter(v => v !== value));
	};

	onSelectChanged = value => {
		const { values } = this.props;
		const valuesSet = new Set(values);

		if (valuesSet.has(value)) {
			valuesSet.delete(value);
		} else {
			valuesSet.add(value);
		}

		this.onChange(Array.from(valuesSet));
	};

	render() {
		const { className } = this.props;

		return (
			<div
				className={cx(
					'multi-select',
					'nti-multi-select-input',
					className
				)}
			>
				{this.renderSelected()}
				{this.renderActive()}
			</div>
		);
	}

	renderSelected() {
		const { placeholder } = this.props;
		const { selectedOptions } = this.state;

		if (!selectedOptions || selectedOptions.length === 0) {
			return <div className={cx('placeholder')}>{placeholder}</div>;
		}

		return (
			<ul className={cx('multi-select-selected-list')}>
				{selectedOptions.map((option, key) => {
					const cmp = React.cloneElement(option, {
						index: key,
						onRemove: this.removeSelected,
						removable: true,
					});

					return <li key={key}>{cmp}</li>;
				})}
			</ul>
		);
	}

	renderActive() {
		const {
			searchPlaceholder,
			optionsClassName,
			onFocus,
			onBlur,
		} = this.props;
		const { activeOptions, selectedOptions } = this.state;
		const selectedSet = new Set(selectedOptions);

		return (
			<Select
				ref={this.attachSelectRef}
				searchable
				maintainOnSelect
				value={null}
				onChange={this.onSelectChanged}
				optionsClassName={optionsClassName}
				onFocus={onFocus}
				onBlur={onBlur}
				placeholder={searchPlaceholder || t('searchPlaceholder')}
			>
				{activeOptions.map((option, key) => {
					const isSelected = selectedSet.has(option);

					if (!isSelected) {
						return React.cloneElement(option, {
							key,
							checkable: true,
						});
					}

					return React.cloneElement(option, {
						key,
						checkable: true,
						checked: true,
					});
				})}
			</Select>
		);
	}
}
