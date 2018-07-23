/* eslint-env jest */
import React from 'react';
import {shallow} from 'enzyme';

import RadioGroup from '../RadioGroup';

describe('TokenEditor', () => {
	const testRender = (props) => [
		shallow(<RadioGroup {...props}/>),
	];

	test('Base Case', async () => {
		testRender({options: ['a', 'b', 'c']});
	});

	//TODO: Validate DOM structure.
	//TODO: Validate children && DIV.sub do not render if it is not checked.
});
