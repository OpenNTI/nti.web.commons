/* eslint-env jest */
import React from 'react';
import { render } from '@testing-library/react';

import LimitLines from '../LimitLines';

describe('LimitLines transform tests', () => {
	describe('statics', () => {
		describe('shouldApply', () => {
			test('true if limitLines prop', () => {
				expect(LimitLines.shouldApply({ limitLines: 2 })).toBeTruthy();
			});
		});
	});

	test('adds nti-limit-lines class', () => {
		const text = 'Test Text';

		const { getByText } = render(
			<LimitLines limitLines={2}>
				<span>{text}</span>
			</LimitLines>
		);
		const node = getByText(text);

		expect(node.classList.contains('multiLineLimit')).toBeTruthy();
	});

	test('forwards ref', () => {
		const ref = jest.fn();
		const text = 'Test Text';

		const { getByText } = render(
			<LimitLines limitLines={2} ref={ref}>
				<span>{text}</span>
			</LimitLines>
		);
		const node = getByText(text);

		expect(ref).toHaveBeenCalledWith(node);
	});

	describe('limitLines', () => {
		test('3 lines + extra styles', () => {
			const color = 'white';
			const text = 'Test Text';

			const { getByText } = render(
				<LimitLines limitLines={3} style={{ color }}>
					<span>{text}</span>
				</LimitLines>
			);
			const node = getByText(text);

			const style = getComputedStyle(node);

			expect(style['color']).toEqual(color);
			expect(style.getPropertyValue('--line-limit')).toEqual('3');
		});
	});
});
