/* eslint-env jest */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import DayPickerRange from '../DayPickerRange';

describe('DayPickerRange', () => {
	const testStartDate = new Date(2017, 8, 22);
	const testEndDate = new Date(2017, 11, 24);

	test('Test no dates provided', () => {
		const {container} = render(<DayPickerRange />);

		const [startDate, endDate] = container.querySelectorAll('.date');

		expect(startDate.querySelector('.value').textContent).toEqual('');
		expect(endDate.querySelector('.value').textContent).toEqual('');

		expect(startDate.querySelector('.remove-date')).toBeFalsy();
		expect(endDate.querySelector('.remove-date')).toBeFalsy();
	});

	test('Test initial dates', () => {
		const {container} = render(
			<DayPickerRange
				startDate={testStartDate}
				endDate={testEndDate}
			/>
		);
		const [startDate, endDate] = container.querySelectorAll('.date');

		expect(startDate.querySelector('.value').textContent).toEqual('Sep 22');
		expect(endDate.querySelector('.value').textContent).toEqual('Dec 24');

		expect(startDate.querySelector('.remove-date')).toBeTruthy();
		expect(endDate.querySelector('.remove-date')).toBeTruthy();
	});

	test('Test date selection', () => {
		const {container} = render(
			<DayPickerRange
				startDate={testStartDate}
				endDate={testEndDate}
			/>
		);
		const [startDate, endDate] = container.querySelectorAll('.date');

		expect(startDate.getAttribute('class')).toMatch(/selected/);
		expect(endDate.getAttribute('class')).not.toMatch(/selected/);
		expect(container.querySelector('.DayPicker-Caption').textContent).toEqual('September 2017');

		fireEvent.click(endDate);

		expect(startDate.getAttribute('class')).not.toMatch(/selected/);
		expect(endDate.getAttribute('class')).toMatch(/selected/);
		expect(container.querySelector('.DayPicker-Caption').textContent).toEqual('December 2017');
	});

	test('Test start date removal', async () => {
		const updateStartDate = jest.fn();
		const updateEndDate = jest.fn();

		const {container} = render(
			<DayPickerRange
				startDate={testStartDate}
				endDate={testEndDate}
				updateStartDate={updateStartDate}
				updateEndDate={updateEndDate}
			/>
		);

		const startDate = container.querySelector('.date');

		fireEvent.click(startDate.querySelector('.remove-date'));

		return waitFor(() => {
			// update called with no params is expected, basically providing
			// a null value as the new value to indicate removal
			expect(updateStartDate).toHaveBeenCalledWith();
			expect(updateEndDate).not.toHaveBeenCalled();
		});
	});

	test('Test end date removal', async () => {
		const updateStartDate = jest.fn();
		const updateEndDate = jest.fn();

		const {container} = render(
			<DayPickerRange
				startDate={testStartDate}
				endDate={testEndDate}
				updateStartDate={updateStartDate}
				updateEndDate={updateEndDate}
			/>
		);

		const endDate = Array.from(container.querySelectorAll('.date')).pop();

		fireEvent.click(endDate.querySelector('.remove-date'));

		return waitFor(() => {
			expect(updateEndDate).toHaveBeenCalledWith();
			expect(updateStartDate).not.toHaveBeenCalled();
		});
	});

	test('Test select start date', async () => {
		const updateStartDate = jest.fn();
		const updateEndDate = jest.fn();

		const {container} = render(
			<DayPickerRange
				startDate={testStartDate}
				endDate={testEndDate}
				updateStartDate={updateStartDate}
				updateEndDate={updateEndDate}
			/>
		);

		expect(container.querySelector('.DayPicker-Caption').textContent).toEqual('September 2017');

		fireEvent.click(container.querySelector('.DayPicker-NavButton--next'));

		expect(container.querySelector('.DayPicker-Caption').textContent).toEqual('October 2017');

		const dayToClick = container.querySelectorAll('.DayPicker-Day')[30];

		fireEvent.click(dayToClick);

		return waitFor(() => {
			const newDate = new Date(2017, 9, 31);

			expect(updateStartDate).toHaveBeenCalledWith(newDate);
			expect(updateEndDate).not.toHaveBeenCalled();

		});
	});

	test('Test select end date', async () => {
		const updateStartDate = jest.fn();
		const updateEndDate = jest.fn();

		const {container} = render(
			<DayPickerRange
				startDate={testStartDate}
				endDate={testEndDate}
				updateStartDate={updateStartDate}
				updateEndDate={updateEndDate}
			/>
		);

		const endDate = Array.from(container.querySelectorAll('.date')).pop();

		fireEvent.click(endDate);

		expect(container.querySelector('.DayPicker-Caption').textContent).toEqual('December 2017');

		fireEvent.click(container.querySelector('.DayPicker-NavButton--prev'));
		fireEvent.click(container.querySelector('.DayPicker-NavButton--prev'));

		expect(container.querySelector('.DayPicker-Caption').textContent).toEqual('October 2017');

		const dayToClick = container.querySelectorAll('.DayPicker-Day')[30];

		fireEvent.click(dayToClick);

		return waitFor(() => {
			const newDate = new Date(2017, 9, 31);

			expect(updateEndDate).toHaveBeenCalledWith(newDate);
			expect(updateStartDate).not.toHaveBeenCalled();

		});
	});
});
