/* eslint-env jest */
import React from 'react';
import {render} from '@testing-library/react';

import {mockComputedStyle} from '../../__test__/utils';
import LimitLines from '../LimitLines';

describe('LimitLines transform tests', () => {
	describe('statics', () => {
		describe('shouldApply', () => {
			test('true if limitLines prop', () => {
				expect(LimitLines.shouldApply({limitLines: 2})).toBeTruthy();
			});

			test('true if forceLines prop', () => {
				expect(LimitLines.shouldApply({forceLines: 2})).toBeTruthy();
			});

			test('false if no limitLines or forceLines prop', () => {
				expect(LimitLines.shouldApply({})).toBeFalsy();
			});
		});
	});

	test('adds nti-limit-lines class', () => {
		const text = 'Test Text';

		const {getByText} = render(<LimitLines limitLines={2}><span>{text}</span></LimitLines>);
		const node = getByText(text);

		expect(node.classList.contains('limitLines')).toBeTruthy();
	});

	test('forwards ref', () => {
		const ref = jest.fn();
		const text = 'Test Text';

		const {getByText} = render(<LimitLines limitLines={2} ref={ref}><span>{text}</span></LimitLines>);
		const node = getByText(text);

		expect(ref).toHaveBeenCalledWith(node);
	});

	describe('limitLines', () => {
		describe('no padding', () => {
			mockComputedStyle({lineHeight: '18.4px', 'padding-top': '0', 'padding-bottom': '0'});

			test('2 Lines', () => {
				const text = 'Test Text';

				const {getByText} = render(<LimitLines limitLines={2}><span>{text}</span></LimitLines>);
				const node = getByText(text);

				expect(node.style['max-height']).toEqual('36px');
			});

			test('3 lines + extra styles', () => {
				const color = 'white';
				const text = 'Test Text';

				const {getByText} = render(<LimitLines limitLines={3} style={{color}}><span>{text}</span></LimitLines>);
				const node = getByText(text);

				expect(node.style['max-height']).toEqual('54px');
				expect(node.style['color']).toEqual(color);
			});
		});

		describe('padding', () => {
			mockComputedStyle({lineHeight: '18.4px', 'padding-top': '10px', 'padding-bottom': '20px'});

			test('2 Lines', () => {
				const text = 'Test Text';

				const {getByText} = render(<LimitLines limitLines={2}><span>{text}</span></LimitLines>);
				const node = getByText(text);

				expect(node.style['max-height']).toEqual('66px');
			});

			test('3 lines + extra styles', () => {
				const color = 'white';
				const text = 'Test Text';

				const {getByText} = render(<LimitLines limitLines={3} style={{color}}><span>{text}</span></LimitLines>);
				const node = getByText(text);

				expect(node.style['max-height']).toEqual('84px');
				expect(node.style['color']).toEqual(color);
			});
		});
	});

	describe('forceLines', () => {
		describe('no padding', () => {
			mockComputedStyle({lineHeight: '18.4px', 'padding-top': '0', 'padding-bottom': '0'});

			test('2 Lines', () => {
				const text = 'Test Text';

				const {getByText} = render(<LimitLines forceLines={2}><span>{text}</span></LimitLines>);
				const node = getByText(text);

				expect(node.style['height']).toEqual('36px');
			});

			test('3 lines + extra styles', () => {
				const color = 'white';
				const text = 'Test Text';

				const {getByText} = render(<LimitLines forceLines={3} style={{color}}><span>{text}</span></LimitLines>);
				const node = getByText(text);

				expect(node.style['height']).toEqual('54px');
				expect(node.style['color']).toEqual(color);
			});
		});

		describe('padding', () => {
			mockComputedStyle({lineHeight: '18.4px', 'padding-top': '10px', 'padding-bottom': '20px'});

			test('2 Lines', () => {
				const text = 'Test Text';

				const {getByText} = render(<LimitLines forceLines={2}><span>{text}</span></LimitLines>);
				const node = getByText(text);

				expect(node.style['height']).toEqual('66px');
			});

			test('3 lines + extra styles', () => {
				const color = 'white';
				const text = 'Test Text';

				const {getByText} = render(<LimitLines forceLines={3} style={{color}}><span>{text}</span></LimitLines>);
				const node = getByText(text);

				expect(node.style['height']).toEqual('84px');
				expect(node.style['color']).toEqual(color);
			});
		});
	});
});
