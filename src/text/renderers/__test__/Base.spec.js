/* eslint-env jest */
import React from 'react';
import {render, fireEvent} from '@testing-library/react';

import Base from '../Base';

describe('Base Text Renderer Test', () => {
	test('renders span by default', () => {
		const ref = jest.fn();
		const text = 'Test Text';
		
		const {getByText} = render(<Base ref={ref}>{text}</Base>);
		const node = getByText(text);

		expect(node.tagName).toEqual('SPAN');
		expect(node.textContent).toEqual(text);
		expect(ref).toHaveBeenCalledWith(node);
	});

	test('renders as tag', () => {
		const ref = jest.fn();
		const text = 'Test Text';
		const tag = 'p';

		const {getByText} = render(<Base ref={ref} as={tag}>{text}</Base>);
		const node = getByText(text);

		expect(node.tagName).toEqual('P');
		expect(node.textContent).toEqual(text);
		expect(ref).toHaveBeenCalledWith(node);
	});

	test('forwards props', () => {
		const click = jest.fn();
		const className = 'test-class';
		const text = 'text';

		const {getByText} = render(<Base onClick={click} className={className}>{text}</Base>);
		const node = getByText(text);

		fireEvent.click(node);

		expect(node.classList.contains(className)).toBeTruthy();
		expect(click).toHaveBeenCalled();
	});
});