/* eslint-env jest */
import React from 'react';
import TestRenderer from 'react-test-renderer';

import RadioGroup from '../RadioGroup';

describe('RadioGroup', () => {
	const testRender = props => [
		TestRenderer.create(<RadioGroup {...props} />),
	];

	test('Base Case', async () => {
		testRender({ options: ['a', 'b', 'c'] });
	});

	//TODO: Validate DOM structure.
	//TODO: Validate children && DIV.sub do not render if it is not checked.
});
