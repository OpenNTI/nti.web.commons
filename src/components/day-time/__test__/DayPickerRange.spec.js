/* eslint-env jest */
import React from 'react';
import {mount} from 'enzyme';

import DayPickerRange from '../DayPickerRange';

describe('DayPickerRange', () => {
	const testStartDate = new Date(2017, 8, 22);
	const testEndDate = new Date(2017, 11, 24);

	const cmp = mount(
		<DayPickerRange
			startDate={testStartDate}
			endDate={testEndDate}
		/>
	);

	test('Test no dates provided', () => {
		const noDates = mount(<DayPickerRange />);

		const startDate = noDates.find('.date').first();
		const endDate = noDates.find('.date').last();

		expect(startDate.find('.value').first().text()).toEqual('');
		expect(endDate.find('.value').first().text()).toEqual('');

		expect(startDate.find('.remove-date').exists()).toBe(false);
		expect(endDate.find('.remove-date').exists()).toBe(false);
	});

	test('Test initial dates', () => {
		const startDate = cmp.find('.date').first();
		const endDate = cmp.find('.date').last();

		expect(startDate.find('.value').first().text()).toEqual('Sep. 22');
		expect(endDate.find('.value').first().text()).toEqual('Dec. 24');

		expect(startDate.find('.remove-date').exists()).toBe(true);
		expect(endDate.find('.remove-date').exists()).toBe(true);
	});

	test('Test date selection', () => {
		let startDate = cmp.find('.date').first();
		let endDate = cmp.find('.date').last();

		expect(startDate.prop('className')).toMatch(/selected/);
		expect(endDate.prop('className')).not.toMatch(/selected/);
		expect(cmp.find('.DayPicker-Caption').first().text()).toEqual('September 2017');

		endDate.simulate('click');

		startDate = cmp.find('.date').first();
		endDate = cmp.find('.date').last();

		expect(startDate.prop('className')).not.toMatch(/selected/);
		expect(endDate.prop('className')).toMatch(/selected/);
		expect(cmp.find('.DayPicker-Caption').first().text()).toEqual('December 2017');
	});

	test('Test start date removal', (done) => {
		const updateStartDate = jest.fn();
		const updateEndDate = jest.fn();

		const cmpForStartDate = mount(
			<DayPickerRange
				startDate={testStartDate}
				endDate={testEndDate}
				updateStartDate={updateStartDate}
				updateEndDate={updateEndDate}
			/>
		);

		const startDate = cmpForStartDate.find('.date').first();

		startDate.find('.remove-date').simulate('click');

		const verifyUpdateCalled = () => {
			// update called with no params is expected, basically providing
			// a null value as the new value to indicate removal
			expect(updateStartDate).toHaveBeenCalledWith();
			expect(updateEndDate).not.toHaveBeenCalled();

			done();
		};

		setTimeout(verifyUpdateCalled, 300);
	});

	test('Test end date removal', (done) => {
		const updateStartDate = jest.fn();
		const updateEndDate = jest.fn();

		const cmpForEndDate = mount(
			<DayPickerRange
				startDate={testStartDate}
				endDate={testEndDate}
				updateStartDate={updateStartDate}
				updateEndDate={updateEndDate}
			/>
		);

		const endDate = cmpForEndDate.find('.date').last();

		endDate.find('.remove-date').simulate('click');

		const verifyUpdateCalled = () => {
			expect(updateEndDate).toHaveBeenCalledWith();
			expect(updateStartDate).not.toHaveBeenCalled();

			done();
		};

		setTimeout(verifyUpdateCalled, 300);
	});

	test('Test select start date', (done) => {
		const updateStartDate = jest.fn();
		const updateEndDate = jest.fn();

		const cmpForStartDate = mount(
			<DayPickerRange
				startDate={testStartDate}
				endDate={testEndDate}
				updateStartDate={updateStartDate}
				updateEndDate={updateEndDate}
			/>
		);

		expect(cmpForStartDate.find('.DayPicker-Caption').first().text()).toEqual('September 2017');

		cmpForStartDate.find('.DayPicker-NavButton--next').first().simulate('click');

		expect(cmpForStartDate.find('.DayPicker-Caption').first().text()).toEqual('October 2017');

		const dayToClick = cmpForStartDate.find('.DayPicker-Day').at(30);

		dayToClick.simulate('click');

		const verifyUpdateCalled = () => {
			const newDate = new Date(2017, 9, 31);

			expect(updateStartDate).toHaveBeenCalledWith(newDate);
			expect(updateEndDate).not.toHaveBeenCalled();

			done();
		};

		setTimeout(verifyUpdateCalled, 300);
	});

	test('Test select end date', (done) => {
		const updateStartDate = jest.fn();
		const updateEndDate = jest.fn();

		const cmpForEndDate = mount(
			<DayPickerRange
				startDate={testStartDate}
				endDate={testEndDate}
				updateStartDate={updateStartDate}
				updateEndDate={updateEndDate}
			/>
		);

		const endDate = cmpForEndDate.find('.date').last();

		endDate.simulate('click');

		expect(cmpForEndDate.find('.DayPicker-Caption').first().text()).toEqual('December 2017');

		cmpForEndDate.find('.DayPicker-NavButton--prev').first().simulate('click');
		cmpForEndDate.find('.DayPicker-NavButton--prev').first().simulate('click');

		expect(cmpForEndDate.find('.DayPicker-Caption').first().text()).toEqual('October 2017');

		const dayToClick = cmpForEndDate.find('.DayPicker-Day').at(30);

		dayToClick.simulate('click');

		const verifyUpdateCalled = () => {
			const newDate = new Date(2017, 9, 31);

			expect(updateEndDate).toHaveBeenCalledWith(newDate);
			expect(updateStartDate).not.toHaveBeenCalled();

			done();
		};

		setTimeout(verifyUpdateCalled, 300);
	});
});
