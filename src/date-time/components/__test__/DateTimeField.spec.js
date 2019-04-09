/* globals spyOn */
/* eslint-env jest */
import React from 'react';
import {shallow} from 'enzyme';
import {Date as DateUtils} from '@nti/lib-commons';

import DateTimeField from '../DateTimeField';
import TimePicker from '../TimePicker';
import Select from '../../../components/Select';

const {MockDate} = DateUtils;

const emptyOnChange = jest.fn();

describe('DateTimeField', () => {
	const sharedWrapper = shallow(<DateTimeField onChange={emptyOnChange} />);

	const testRender = (props, ...children) => [
		shallow(<DateTimeField {...props}>{children}</DateTimeField>),
		sharedWrapper.setProps({...props, children})
	];

	afterEach(() => {
		MockDate.uninstall();
	});

	test('Base case: Nothing Passed - Value to be undefined', () => {
		testRender({ onChange: () => {} })
			.forEach(x => {
				const dateSelects = x.find(Select);
				const time = x.find(TimePicker);
				dateSelects.forEach(select => expect(select.props().value).toBeUndefined());
				expect(time.props().value).toBeUndefined();
			});
	});

	test('on date change is called with clicked month', () => {
		testRender({ onChange: value => value })
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

	test('on date change is called with clicked date', () => {
		testRender({ onChange: value => value })
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

	test('on date change is called with clicked year', () => {
		testRender({ onChange: value => value })
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

	test('clicking current date calls onchange with current date', () => {
		const onChangeSpy = jest.fn();
		const now = new Date();
		MockDate.install(now);

		testRender({ onChange: onChangeSpy, currentDate: true })
			.forEach(x => {
				const currentDate = x.find('.set-current-date a');
				currentDate.simulate('click');
				expect(onChangeSpy).toHaveBeenCalledWith(now);
			});
	});

	test('Selecting a month updates every select box', () => {
		const onChangeSpy = jest.fn();

		const now = new Date();
		MockDate.install(now);

		const value = new Date();
		value.setMonth('7');
		value.setDate('1');
		value.setHours(23);
		value.setMinutes(59);

		testRender({ onChange: onChangeSpy})
			.forEach(x => {
				const monthSelect = x.find('.month-wrapper Select');
				const event = { target: {value: '7'}};
				monthSelect.simulate('change', event);

				expect(onChangeSpy).toHaveBeenCalledWith(value);
			});
	});

	test('updating when a prop value was intially passed', () => {
		const onChangeSpy = jest.fn();

		const now = new Date();
		MockDate.install(now);

		const value = new Date();
		value.setMonth(6);
		value.setDate(3);

		const expectedValue = new Date();
		expectedValue.setMonth(7);
		expectedValue.setDate(3);

		testRender({ onChange: onChangeSpy, value })
			.forEach(x => {
				const monthSelect = x.find('.month-wrapper Select');
				const event = { target: {value: '7'}};
				monthSelect.simulate('change', event);

				expect(onChangeSpy).toHaveBeenCalledWith(expectedValue);
			});
	});


	test('change the time updates the time and keeps the date', () => {
		const onChangeSpy = jest.fn();

		const now = new Date();
		MockDate.install(now);

		const value = new Date();
		value.setMinutes(8);

		testRender({ onChange: onChangeSpy })
			.forEach(x => {
				const timePicker = x.find(TimePicker) && x.find(TimePicker).shallow();
				const time = timePicker.childAt(0);
				const minute = time.childAt(2);
				const minuteInput = minute.shallow().find('input');
				minuteInput.simulate('change', { target: { value: 8 }, stopPropagation: () => {}, preventDefault: () => {} });

				expect(onChangeSpy).toHaveBeenCalledWith(value);
			});
	});

	test('render the correct day options', () => {
		const value = new Date('Wed Feb 1 2017 18:00:00 GMT-0600 (CST)');

		testRender({value, onChange: () => {}})
			.forEach(x => {
				const daySelect = x.find('.date-wrapper Select');
				expect(daySelect.find('option[value=1]').exists()).toBeTruthy();
				expect(daySelect.find('option[value=28]').exists()).toBeTruthy();

				expect(daySelect.find('option[value=0]').exists()).toBeFalsy();
				expect(daySelect.find('option[value=29]').exists()).toBeFalsy();
			});
	});

	// this test has to come before the one below—the one that sets startYear and numYears
	// props—because the sharedWrapper instance retains any previously set props unless they're
	// explicitly overwritten.
	test('render the current year and five subsequent years by default', () => {

		const currentYear = new Date().getFullYear();
		const numYears = 6;

		testRender({ value: null, onChange: () => {} })
			.forEach(x => {
				const yearSelect = x.find('.year-wrapper Select');

				// all the correct years
				Array.from({length: numYears}).forEach((_, i) => expect(yearSelect.find(`option[value=${currentYear + i}]`).exists()).toBeTruthy());

				// not earlier
				expect(yearSelect.find(`option[value=${currentYear - 1}]`).exists()).toBeFalsy();

				// not later
				expect(yearSelect.find(`option[value=${currentYear + numYears}]`).exists()).toBeFalsy();
			});
	});


	test('render the correct years when passed startYear and numYears', () => {

		const startYear = 2001;
		const numYears = 5;

		testRender({ startYear: startYear, numYears: numYears, onChange: () => {} })
			.forEach(x => {
				const yearSelect = x.find('.year-wrapper Select');

				// all the correct years
				Array.from({length: numYears}).forEach((_, i) => expect(yearSelect.find(`option[value=${startYear + i}]`).exists()).toBeTruthy());

				// not earlier
				expect(yearSelect.find(`option[value=${startYear - 1}]`).exists()).toBeFalsy();

				// not later
				expect(yearSelect.find(`option[value=${startYear + numYears}]`).exists()).toBeFalsy();

				// why doesn't this work?
				// expect(yearSelect.containsAllMatchingElements([
				// 	<option value={2001}>2001</option>,
				// 	<option value={2002}>2002</option>,
				// 	<option value={2003}>2003</option>,
				// 	<option value={2004}>2004</option>,
				// 	<option value={2005}>2005</option>
				// ])).toBeTruthy();
			});
	});


	test('show the error message passed to it', () => {
		const errorMessage = 'Can\'t set due date before end date.';
		testRender({ onChange: () => {}, error: errorMessage})
			.forEach(x => {
				const error = x.find('.date-time-field-error');
				expect(error.text()).toBe(errorMessage);
			});
	});


	test('inclue an option for the specified value\'s year when it\'s outside regular option bounds', () => {
		const value = new Date();

		// the past
		value.setYear(1980);
		testRender({value, onChange: () => {}})
			.forEach(x => {
				const yearSelect = x.find('.year-wrapper Select');
				expect(yearSelect.find('option[value=1980]').exists()).toBeTruthy();
			});

		// the future
		value.setYear(2038);
		testRender({value, onChange: () => {}})
			.forEach(x => {
				const yearSelect = x.find('.year-wrapper Select');
				expect(yearSelect.find('option[value=2038]').exists()).toBeTruthy();
			});
	});
});
