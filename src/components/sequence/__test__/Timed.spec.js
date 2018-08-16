/* eslint-env jest */
import React from 'react';
import TestRenderer from 'react-test-renderer';

import Timed from '../Timed';

describe('Timed', () => {
	const sharedWrapper = TestRenderer.create(<Timed />);

	const testRender = (props) => [
		TestRenderer.create(<Timed {...props}><div/></Timed>),
		sharedWrapper.update(<Timed {...props}><div/></Timed>)
	];

	test('Base Case', async () => {
		testRender({});
	});

	//TODO: Validate DOM structure.
	//TODO: Validate children && DIV.sub do not render if it is not checked.
});
