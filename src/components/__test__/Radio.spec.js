/* eslint-env jest */
import React from 'react';
import {shallow} from 'enzyme';

import Radio from '../Radio';

describe('Radio', () => {
	const sharedWrapper = shallow(<Radio />);

	const testRender = (props, ...children) => [
		shallow(<Radio {...props}>{children}</Radio>),
		sharedWrapper.setProps({...props, children})
	];

	test('Base Case', () => {
		testRender({label: 'test'})
			.map(x => x.find('.label').text())
			.forEach(x => expect(x).toEqual('test'));
	});

	//TODO: Validate DOM structure.
	//TODO: Validate children && DIV.sub do not render if it is not checked.
});
