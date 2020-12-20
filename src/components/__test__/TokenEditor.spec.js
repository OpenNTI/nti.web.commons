/* eslint-env jest */
import React from 'react';
import { render } from '@testing-library/react';

import TokenEditor from '../TokenEditor';

describe('TokenEditor', () => {
	const shared = render(<TokenEditor />);

	const testRender = (props, ...children) => [
		render(React.createElement(TokenEditor, props, ...children)),
		(shared.rerender(React.createElement(TokenEditor, props, ...children)),shared)
	];

	test('Base Case', async () => {
		testRender({value: ['test']});
	});

	//TODO: Validate DOM structure.
	//TODO: Validate children && DIV.sub do not render if it is not checked.
});
