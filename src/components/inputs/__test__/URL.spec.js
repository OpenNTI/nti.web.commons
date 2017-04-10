import React from 'react';
import {mount} from 'enzyme';

import URL from '../URL';
import Text from '../Text';

describe('URL Input', () => {
	it('attaches ref', () => {
		const wrapper = mount(<URL />);
		const text = wrapper.find(Text);

		expect(wrapper.getNode().input).toEqual(text.getNode());
	});
});