/* eslint-env jest */
import React from 'react';
import {shallow} from 'enzyme';

import AssetIcon from '../AssetIcon';

describe('AssetIcon', () => {
	test('should render a \'jpeg\' label', () => {
		const wrapper = shallow(<AssetIcon mimeType="image/jpeg" />);
		expect(wrapper.find('.file-type label').length === 1);
		expect(wrapper.find('label').text()).toEqual('jpeg');
	});
});
