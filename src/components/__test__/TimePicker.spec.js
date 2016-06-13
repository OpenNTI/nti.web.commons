import React from 'react';
import {shallow, mount} from 'enzyme';
import TimePicker from '../TimePicker';
import Time from 'nti-commons/lib/Time';
const ARROW_UP = 40;
const ARROW_DOWN = 38;

describe('TimePicker', () => {
	const sharedWrapper = mount(<TimePicker />);

	const test = (props = {}, ...children) => [
		mount(<TimePicker {...props} children={children}/>),
		sharedWrapper.setProps({...props, children})
	];
	/* INTERNAL STATE TESTS: NO PROPS, NO CHANGE HANDLER */
	it('Base case: Check if it defaults to now', () => {
		const now = new Date();
		test()
			.map(x => x.state('value'))
			.forEach(value => {
				expect(value.getHours()).toEqual(now.getHours());
				expect(value.getMinutes()).toEqual(now.getMinutes());
			});
	});

	it('Check if twentyFourHourTime is false', () => {
		test()
			.map(x => x.state('tfTime'))
			.forEach(tfTime => {
				expect(tfTime).toEqual(false);
			});
	});
	// check if wrapping up work
	it('wraps to from noon to 1 pm works', () => {
		test()
			.map((picker) => {
				const noon = new Date();
				noon.setHours(12);
				noon.setMinutes(0);
				picker.setState({value: new Time(noon)});
				const hourInput = picker.find('input[name="hours"]');
				hourInput.simulate('keyDown', {code: ARROW_UP, key: 'ArrowUp'});
				return picker.state('value');
			})
			.forEach( (value) => {
				expect(value.getHours()).toEqual(13);
				expect(value.getMinutes()).toEqual(0);
				expect(value.getPeriod()).toEqual('PM');
			});
	});
	// Check if wrapping down works
	it('wraps to from 1pm to noon works', () => {
		test()
			.map((picker) => {
				const onePM = new Date();
				onePM.setHours(13);
				onePM.setMinutes(0);
				picker.setState({value: new Time(onePM)});

				const hourInput = picker.find('input[name="hours"]');
				hourInput.simulate('keyDown', {code: ARROW_DOWN, key: 'ArrowDown'});
				return picker.state('value');
			})
			.forEach( (value) => {
				expect(value.getHours()).toEqual(12);
				expect(value.getMinutes()).toEqual(0);
				expect(value.getPeriod()).toEqual('PM');
			});
	});
	//
	it('changes to twentyFourHourTime when typed in', () => {
		test()
			.map((picker) => {
				// Increment Hours
				const hourInput = picker.find('input[name="hours"]');
				hourInput.simulate('change', {target: {value: '13'}});
				return picker.state('tfTime');
			})
			.forEach( (tfTime) => {
				expect(tfTime).toEqual(true);
			});
	});

	it('wraps when in twentyFourHourTime from 23 to 0', () => {
		test()
			.map(picker => {
				const hourInput = picker.find('input[name="hours"]');
				hourInput.simulate('change', {target: {value: '23'}});
				hourInput.simulate('keyDown', {code: ARROW_UP, key: 'ArrowUp'});
				return picker.state('value');
			})
			.forEach(value => {
				expect(value.getHours()).toEqual(0);
				expect(value.getPeriod()).toEqual('AM');
			});
	});

	it('wraps when in twentyFourHourTime from 0 to 23', () => {
		test()
			.map(picker => {
				const hourInput = picker.find('input[name="hours"]');
				hourInput.simulate('change', {target: {value: '0'}});
				hourInput.simulate('keyDown', {code: ARROW_DOWN, key: 'ArrowDown'});
				return picker.state('value');
			})
			.forEach(value => {
				expect(value.getHours()).toEqual(23);
				expect(value.getPeriod()).toEqual('PM');
			});
	});
	/* ------------------------------------------------------------------ */
	// Check to see if period is disabled
	// check errors
	//Test that passing a value prop and no onChnge handler, the value never updates no matter what the user does. (readonly mode)
	//Test that passing a value prop and onChnge handler, the value only updates what the parent passes as the value prop. (normal expected interaction)
	//Test that passing no value prop, and onChange the ui updates as user interacts. And onChange calls with new values. (lazy mode)
	//Test that no props behaves normally too, but should warn that there isn't a legitimate way of getting values/output.
});
