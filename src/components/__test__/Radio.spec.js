/* eslint-env jest */
import React from 'react';
import { render } from '@testing-library/react';

import Radio from '../Radio';

describe('Radio', () => {
	const shared = render(<Radio />);

	const testRender = (props, ...children) => [
		render(React.createElement(Radio, props, ...children)),
		(shared.rerender(React.createElement(Radio, props, ...children)),shared)
	];

	test('Base Case', () => {
		testRender({label: 'test'})
			.map(x => x.container.querySelector('.label').textContent)
			.forEach(x => expect(x).toEqual('test'));
	});

	//TODO: Validate DOM structure.
	//TODO: Validate children && DIV.sub do not render if it is not checked.
});
