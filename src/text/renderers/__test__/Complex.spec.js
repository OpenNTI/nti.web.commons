/* eslint-env jest */
import React from 'react';
import { render } from '@testing-library/react';

import Complex from '../Complex';

const INLINE_CLS = 'inline-component';
const INLINE_TEXT = 'inline text';

function InlineComponent() {
	return <b className={INLINE_CLS}>{INLINE_TEXT}</b>;
}

describe('Complex Text Renderer Test', () => {
	test('renders child components', () => {
		const { asFragment } = render(<Complex text={<InlineComponent />} />);
		const fragment = asFragment();

		const span = fragment.querySelector('span');
		const inlineCmp = span.querySelector(`.${INLINE_CLS}`);

		expect(inlineCmp.textContent).toEqual(INLINE_TEXT);
	});

	test('forwards ref', () => {
		const ref = jest.fn();
		const text = 'test';

		const { getByText } = render(<Complex text={text} ref={ref} />);
		const node = getByText(text);

		expect(ref).toHaveBeenCalledWith(node);
	});
});
