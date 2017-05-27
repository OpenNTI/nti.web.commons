import React from 'react';
import {shallow} from 'enzyme';
import {Date as DateUtils} from 'nti-commons';

import DateTimeField from '../DateTimeField';
import TimePicker from '../../TimePicker';
import Select from '../../Select';

const {MockDate} = DateUtils;

describe('DateTimeField', () => {
	const emptyOnChagne = () => {};
	const sharedWrapper = shallow(<DateTimeField onChange={emptyOnChagne} />);

	const test = (props, ...children) => [
		shallow(<DateTimeField {...props}>{children}</DateTimeField>),
		sharedWrapper.setProps({...props, children})
	];

	afterEach(() => {
		MockDate.uninstall();
	});

	it('Base case: Nothing Passed - Value to be undefined', () => {
		test({ onChange: () => {} })
			.forEach(x => {
				const dateSelects = x.find(Select);
				const time = x.find(TimePicker);
				dateSelects.forEach(select => expect(select.props().value).toBeUndefined());
				expect(time.props().value).toBeUndefined();
			});
	});

	it('on date change is called with clicked month', () => {
		test({ onChange: value => value })
			.forEach(x => {
				const cmp = x.instance();
				spyOn(cmp,'onDateChange');

				const monthSelect = x.find('.month-wrapper Select');
				const event = { target: {value: '9'}};
				monthSelect.simulate('change', event);

				expect(cmp.onDateChange).toHaveBeenCalled();
				expect(cmp.onDateChange).toHaveBeenCalledWith('9', 'setMonth');
			});
	});

	it('on date change is called with clicked date', () => {
		test({ onChange: value => value })
			.forEach(x => {
				const cmp = x.instance();
				spyOn(cmp,'onDateChange');

				const dateSelect = x.find('.date-wrapper Select');
				const event = { target: {value: '20'}};
				dateSelect.simulate('change', event);

				expect(cmp.onDateChange).toHaveBeenCalled();
				expect(cmp.onDateChange).toHaveBeenCalledWith('20', 'setDate');
			});
	});

	it('on date change is called with clicked year', () => {
		test({ onChange: value => value })
			.forEach(x => {
				const cmp = x.instance();
				spyOn(cmp,'onDateChange');

				const yearSelect = x.find('.year-wrapper Select');
				const event = { target: {value: '2018'}};
				yearSelect.simulate('change', event);

				expect(cmp.onDateChange).toHaveBeenCalled();
				expect(cmp.onDateChange).toHaveBeenCalledWith('2018', 'setYear');
			});
	});

	it('clicking current date calls onchange with current date', () => {
		const onChangeSpy = jest.fn();
		const now = new Date();
		MockDate.install(now);

		test({ onChange: onChangeSpy, currentDate: true })
			.forEach(x => {
				const currentDate = x.find('.set-current-date a');
				currentDate.simulate('click');
				expect(onChangeSpy).toHaveBeenCalledWith(now);
			});
	});

	it('Selecting a month updates every select box', () => {
		const onChangeSpy = jest.fn();

		const now = new Date();
		MockDate.install(now);

		const value = new Date();
		value.setMonth('7');
		value.setDate('1');
		value.setHours(23);
		value.setMinutes(59);

		test({ onChange: onChangeSpy})
			.forEach(x => {
				const monthSelect = x.find('.month-wrapper Select');
				const event = { target: {value: '7'}};
				monthSelect.simulate('change', event);

				expect(onChangeSpy).toHaveBeenCalledWith(value);
			});
	});

	it('updating when a prop value was intially passed', () => {
		const onChangeSpy = jest.fn();

		const now = new Date();
		MockDate.install(now);

		const value = new Date();
		value.setMonth(6);
		value.setDate(3);

		const expectedValue = new Date();
		expectedValue.setMonth(7);
		expectedValue.setDate(3);

		test({ onChange: onChangeSpy, value })
			.forEach(x => {
				const monthSelect = x.find('.month-wrapper Select');
				const event = { target: {value: '7'}};
				monthSelect.simulate('change', event);

				expect(onChangeSpy).toHaveBeenCalledWith(expectedValue);
			});
	});


	it('change the time updates the time and keeps the date', () => {
		const onChangeSpy = jest.fn();

		const now = new Date();
		MockDate.install(now);

		const value = new Date();
		value.setMinutes(8);

		test({ onChange: onChangeSpy })
			.forEach(x => {
				const timePicker = x.find(TimePicker) && x.find(TimePicker).shallow();
				const time = timePicker.childAt(0);
				const minute = time.childAt(2);
				const minuteInput = minute.shallow().find('input');
				minuteInput.simulate('change', { target: { value: 8 }, stopPropagation: () => {}, preventDefault: () => {} });

				expect(onChangeSpy).toHaveBeenCalledWith(value);
			});
	});


	it('show the error message passed to it', () => {
		const errorMessage = 'Can\'t set due date before end date.';
		test({ onChange: () => {}, error: errorMessage})
			.forEach(x => {
				const error = x.find('.date-time-field-error');
				expect(error.text()).toBe(errorMessage);
			});
	});
});
