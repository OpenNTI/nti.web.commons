/* eslint-env jest */
import React from 'react';
import {shallow} from 'enzyme';

import Timed from '../Timed';

describe('TokenEditor', () => {
	const sharedWrapper = shallow(<Timed />);

	const testRender = (props) => [
		shallow(<Timed {...props}><div/></Timed>),
		sharedWrapper.setProps({...props})
	];

	test('Base Case', async () => {
		testRender({});
	});

	//TODO: Validate DOM structure.
	//TODO: Validate children && DIV.sub do not render if it is not checked.
});
