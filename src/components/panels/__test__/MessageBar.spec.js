import React from 'react';
import renderer from 'react-test-renderer';

import MessageBar from '../MessageBar';

/* eslint-env jest */
describe('Panels: Message Bar', () => {
	test('Generic Snapshot', () => {
		const tree = renderer.create(<MessageBar message="hey it's me ya boi" />).toJSON();
		expect(tree).toMatchSnapshot();
	});

	test('Error Snapshot', () => {
		const tree = renderer.create(<MessageBar message="Unable to upload file." error />).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
