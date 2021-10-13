/* eslint-env jest */
import { render } from '@testing-library/react';

import PlainText from '../PlainText';

describe('Plain Text Renderer Test', () => {
	test('does not render markup', () => {
		const text = 'test <b>plain</b> text';

		const { asFragment } = render(<PlainText as="span" text={text} />);
		const fragment = asFragment();

		const span = fragment.querySelector('span');
		const b = span.querySelector('b');

		expect(span.textContent).toEqual(text);
		expect(b).toBeNull();
	});

	test('forwards ref', () => {
		const ref = jest.fn();
		const text = 'text';

		const { getByText } = render(<PlainText ref={ref} text={text} />);
		const node = getByText(text);

		expect(ref).toHaveBeenCalledWith(node);
	});
});
