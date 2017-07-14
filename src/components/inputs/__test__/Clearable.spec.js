/* globals spyOn */
/* eslint-env jest */
import React from 'react';
import {mount} from 'enzyme';

import Clearable from '../Clearable';
import Text from '../Text';

describe('Clearable Inputs', () => {

	function buildProps (props) {
		const newProps = {...props, onChange: () => {}};

		spyOn(newProps, 'onChange');

		return newProps;
	}

	test('No onClear calls onChange with null on the input', () => {
		const inputProps = buildProps({});
		const clearProps = buildProps({});

		const wrapper = mount(<Clearable {...clearProps} ><Text {...inputProps} /></Clearable>);
		const clearButton = wrapper.find('.reset');

		clearButton.simulate('click');

		expect(inputProps.onChange).toHaveBeenCalledWith(null);
	});

	test('onClear is called when present and onChange is not', () => {
		const inputProps = buildProps({});
		const clearProps = buildProps({onClear: () => {}});

		spyOn(clearProps, 'onClear');

		const wrapper = mount(<Clearable {...clearProps} ><Text {...inputProps} /></Clearable>);
		const clearButton = wrapper.find('.reset');

		clearButton.simulate('click');

		expect(clearProps.onClear).toHaveBeenCalled();
		expect(inputProps.onChange).not.toHaveBeenCalled();
	});
});
