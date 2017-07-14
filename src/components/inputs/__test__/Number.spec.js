/* globals spyOn */
/* eslint-env jest */
import React from 'react';
import {mount} from 'enzyme';

import NumberInput from '../Number';

describe('Number Input', () => {
	function buildProps (props) {
		const newProps = {...props, onChange: () => {}};

		spyOn(newProps, 'onChange');

		return newProps;
	}

	describe('onChange', () => {
		test('Change to the input triggers the on change prop', () => {
			const props = buildProps({});
			const wrapper = mount(<NumberInput {...props} />);
			const input = wrapper.find('input');

			input.simulate('change', {target: {value: '5'}});

			expect(props.onChange).toHaveBeenCalledWith(5);
		});

		test('Changing the props updates the input', () => {
			const props = buildProps({value: 5});
			const wrapper = mount(<NumberInput {...props} />);
			const input = wrapper.find('input');

			expect(input.prop('value')).toEqual('5');

			wrapper.setProps({value: 10});

			expect(input.prop('value')).toEqual('10');
		});
	});


	describe('Arrow Keys', () => {
		test('Up Arrow increases value by step', () => {
			const props = buildProps({value: 5, step: 5});
			const wrapper = mount(<NumberInput {...props} />);
			const input = wrapper.find('input');

			input.simulate('keydown', {keyCode: 38});

			expect(props.onChange).toHaveBeenCalledWith(10);
		});

		test('Down Arrow decreases value by step', () => {
			const props = buildProps({value: 5, step: 5});
			const wrapper = mount(<NumberInput {...props} />);
			const input = wrapper.find('input');

			input.simulate('keydown', {keyCode: 40});

			expect(props.onChange).toHaveBeenCalledWith(0);
		});

		test('Default step is 1', () => {
			const props = buildProps({value: 5});
			const wrapper = mount(<NumberInput {...props} />);
			const input = wrapper.find('input');

			input.simulate('keydown', {keyCode: 38});

			expect(props.onChange).toHaveBeenCalledWith(6);
		});

		test('Doesn\'t step above max', () => {
			const props = buildProps({value: 5, max: 5});
			const wrapper = mount(<NumberInput {...props} />);
			const input = wrapper.find('input');

			input.simulate('keydown', {keyCode: 38});

			expect(props.onChange).not.toHaveBeenCalled();
		});

		test('Doesn\'t step below min', () => {
			const props = buildProps({value: 5, min: 5});
			const wrapper = mount(<NumberInput {...props} />);
			const input = wrapper.find('input');

			input.simulate('keydown', {keyCode: 40});

			expect(props.onChange).not.toHaveBeenCalled();
		});
	});

	describe('Constrain', () => {
		test('Doesn\'t call on change with a value greater than max', () => {
			const props = buildProps({max: 5, constrain: true});
			const wrapper = mount(<NumberInput {...props} />);
			const input = wrapper.find('input');

			input.simulate('change', {target: {value: 6}});

			expect(props.onChange).toHaveBeenCalledWith(5);
		});

		test('Doesn\'t call on change with a value less than min', () => {
			const props = buildProps({min: 5, constrain: true});
			const wrapper = mount(<NumberInput {...props} />);
			const input = wrapper.find('input');

			input.simulate('change', {target: {value: 4}});

			expect(props.onChange).toHaveBeenCalledWith(5);
		});
	});
});
