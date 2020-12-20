/* globals spyOn */
/* eslint-env jest */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import {Date as DateUtils} from '@nti/lib-commons';

import DateTimeField from '../DateTimeField';

const {MockDate} = DateUtils;

const emptyOnChange = jest.fn();

describe('DateTimeField', () => {
	const shared = render(<DateTimeField onChange={emptyOnChange} />);

	const testRender = (props, ...children) => {
		const refs = [
			React.createRef(),
			React.createRef(),
		];
		return [
			{ref: refs[0], ...render(React.createElement(DateTimeField, {ref: refs[0], ...props}, ...children))},
			{ref: refs[1], ...(shared.rerender(React.createElement(DateTimeField, {ref: refs[1],...props}, ...children)), shared)}
		];
	};

	afterEach(() => {
		MockDate.uninstall();
	});

	test('Base case: Nothing Passed - Value to be undefined', () => {
		testRender({ onChange: () => {} })
			.forEach(x => {
				expect([...x.container.querySelectorAll('select')].map(_ => _.value)).toEqual(['empty', 'empty', 'empty']);
			});
	});

	test('on date change is called with clicked month', () => {
		const [x] = testRender({ onChange: value => value });
		const cmp = x.ref.current;
		spyOn(cmp,'onDateChange');

		const monthSelect = x.container.querySelector('.month-wrapper Select');
		const event = { target: {value: '9'}};
		fireEvent.change(monthSelect, event);

		expect(cmp.onDateChange).toHaveBeenCalledWith(event.target.value, 'setMonth');
	});

	test('on date change is called with clicked date', () => {
		const [x] = testRender({ onChange: value => value });

		const cmp = x.ref.current;
		spyOn(cmp,'onDateChange');

		const dateSelect = x.container.querySelector('.date-wrapper Select');
		const event = {target: {value: '20'}};
		fireEvent.change(dateSelect, event);

		expect(cmp.onDateChange).toHaveBeenCalledWith(event.target.value, 'setDate');
	});

	test('on date change is called with clicked year', () => {
		const [x] = testRender({ onChange: value => value });

		const cmp = x.ref.current;
		spyOn(cmp,'onDateChange');

		const yearSelect = x.container.querySelector('.year-wrapper Select');
		const event = {target: {value: String(new Date().getFullYear())}};
		fireEvent.change(yearSelect, event);

		expect(cmp.onDateChange).toHaveBeenCalledWith(event.target.value, 'setYear');
	});

	test('clicking current date calls onchange with current date', () => {
		const onChangeSpy = jest.fn();
		const now = new Date();
		MockDate.install(now);

		testRender({ onChange: onChangeSpy, currentDate: true })
			.forEach(x => {
				const currentDate = x.container.querySelector('.set-current-date a');
				fireEvent.click(currentDate);
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
				const monthSelect = x.container.querySelector('.month-wrapper Select');
				const event = { target: {value: '7'}};
				fireEvent.change(monthSelect, event);

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
				const monthSelect = x.container.querySelector('.month-wrapper Select');
				const event = { target: {value: '7'}};
				fireEvent.change(monthSelect, event);

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
				const minuteInput = x.container.querySelector('input[name=minutes]');

				fireEvent.change(minuteInput, { target: { value: 8 }, stopPropagation: () => {}, preventDefault: () => {} });

				expect(onChangeSpy).toHaveBeenCalledWith(value);
			});
	});

	test('render the correct day options', () => {
		const value = new Date('Wed Feb 1 2017 18:00:00 GMT-0600 (CST)');

		testRender({value, onChange: () => {}})
			.forEach(x => {
				const daySelect = x.container.querySelector('.date-wrapper Select');
				expect(daySelect.querySelector('option[value="1"]')).toBeTruthy();
				expect(daySelect.querySelector('option[value="28"]')).toBeTruthy();

				expect(daySelect.querySelector('option[value="0"]')).toBeFalsy();
				expect(daySelect.querySelector('option[value="29"]')).toBeFalsy();
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
				const yearSelect = x.container.querySelector('.year-wrapper Select');

				// all the correct years
				Array.from({length: numYears}).forEach((_, i) => expect(yearSelect.querySelector(`option[value="${currentYear + i}"]`)).toBeTruthy());

				// not earlier
				expect(yearSelect.querySelector(`option[value="${currentYear - 1}"]`)).toBeFalsy();

				// not later
				expect(yearSelect.querySelector(`option[value="${currentYear + numYears}"]`)).toBeFalsy();
			});
	});


	test('render the correct years when passed startYear and numYears', () => {

		const startYear = 2001;
		const numYears = 5;

		testRender({ startYear: startYear, numYears: numYears, onChange: () => {} })
			.forEach(x => {
				const yearSelect = x.container.querySelector('.year-wrapper Select');

				// all the correct years
				Array.from({length: numYears}).forEach((_, i) => expect(yearSelect.querySelector(`option[value="${startYear + i}"]`)).toBeTruthy());

				// not earlier
				expect(yearSelect.querySelector(`option[value="${startYear - 1}"]`)).toBeFalsy();

				// not later
				expect(yearSelect.querySelector(`option[value="${startYear + numYears}"]`)).toBeFalsy();

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
				const error = x.container.querySelector('.date-time-field-error');
				expect(error.textContent).toBe(errorMessage);
			});
	});


	test('include an option for the specified value\'s year when it\'s outside regular option bounds', () => {
		const value = new Date();

		// the past
		value.setYear(1980);
		testRender({value, onChange: () => {}})
			.forEach(x => {
				const yearSelect = x.container.querySelector('.year-wrapper Select');
				expect(yearSelect.querySelector('option[value="1980"]')).toBeTruthy();
			});

		// the future
		value.setYear(2038);
		testRender({value, onChange: () => {}})
			.forEach(x => {
				const yearSelect = x.container.querySelector('.year-wrapper Select');
				expect(yearSelect.querySelector('option[value="2038"]')).toBeTruthy();
			});
	});
});
