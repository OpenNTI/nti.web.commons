/* eslint-env jest */
import React from 'react';
import {render} from '@testing-library/react';

import Markup from '../Markup';

describe('Markup text renderer', () => {
	test('renders markup', () => {
		const boldText = 'mark up';
		const text = `test <b>${boldText}</b> text`;

		const {asFragment} = render(<Markup text={text} />);
		const fragment = asFragment();

		const span = fragment.querySelector('span');
		const bold = span.querySelector('b');

		expect(span.innerHTML).toEqual(text);
		expect(bold.textContent).toEqual(boldText);
	});

	test('forwards ref', () => {
		const ref = jest.fn();
		const text = 'test';

		const {getByText} = render(<Markup text={text} />);
		const node = getByText(text);

		expect(ref).toHaveBeenCalledWith(node);
	});
});