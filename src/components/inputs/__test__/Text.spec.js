import React from 'react';
import {mount} from 'enzyme';

import Text from '../Text';

describe('Text Input', () => {
	it('attaches ref', () => {
		const wrapper = mount(<Text />);
		const input = wrapper.find('input');

		expect(wrapper.getNode().input).toEqual(input.getNode());
	});

	describe('onChange', () => {
		let wrapper;
		let props;

		beforeEach(() => {
			props = {
				onChange: () => {},
				value: 'test'
			};

			spyOn(props, 'onChange');

			wrapper = mount(<Text {...props} />);
		});

		it('Change to the input triggers the on change callback', () => {
			const input = wrapper.find('input');

			input.simulate('change', {target: {value: 'new'}});

			expect(props.onChange).toHaveBeenCalledWith('new');
		});

		it('Setting new prop updates input', () => {
			const input = wrapper.find('input');

			expect(input.prop('value')).toEqual('test');

			wrapper.setProps({value: 'new'});

			expect(input.prop('value')).toEqual('new');
		});
	});

	// describe('clear', () => {
	// 	it('Clear calls on change', () => {
	// 		const props = {onChange: () => {}};
	// 		spyOn(props, 'onChange');

	// 		const wrapper = mount(<Text {...props} />);

	// 		const clear = wrapper.find('.reset');

	// 		clear.simulate('click');

	// 		expect(props.onChange).toHaveBeenCalledWith('');
	// 	});

	// 	it('Disable Clear doesn\'t render the button', () => {
	// 		const wrapper = mount(<Text disableClear />);
	// 		const clear = wrapper.find('.reset');

	// 		expect(clear.getNodes().length).toEqual(0);
	// 	});
	// });

	// describe('label', () => {
	// 	it('Renders label', () => {
	// 		const wrapper = mount(<Text label="label" />);
	// 		const label = wrapper.find('.label');

	// 		expect(label.text()).toEqual('label');
	// 	});

	// 	it('Doesn\'t render label', () => {
	// 		const wrapper = mount(<Text />);
	// 		const label = wrapper.find('.label');

	// 		expect(label.getNodes().length).toEqual(0);
	// 	});
	// });
});
