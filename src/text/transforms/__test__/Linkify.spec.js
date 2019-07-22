/* eslint-env jest */
import React from 'react';
import PropTypes from 'prop-types';
import {render} from '@testing-library/react';
import {rawContent} from '@nti/lib-commons';

import Linkify from '../Linkify';

const TEST_ID = 'test-id';

InnerWrapper.propTypes = {
	text: PropTypes.string,
	hasMarkup: PropTypes.bool,
	innerRef: PropTypes.func
};
function InnerWrapper ({text, hasMarkup, innerRef}) {
	return (
		<span data-testid={TEST_ID} data-hasmarkup={hasMarkup} ref={innerRef} {...rawContent(text)} />
	);
}

const Inner = React.forwardRef((props, ref) => (<InnerWrapper {...props} innerRef={ref} />));//eslint-disable-line

describe('Linkify Tests', () => {
	describe('statics', () => {
		describe('shouldApply', () => {
			test('true if linkify and not hasComponents', () => {
				expect(Linkify.shouldApply({linkify: true, hasComponents: false})).toBeTruthy();
			});

			test('false if not linkify and not hasComponents', () => {
				expect(Linkify.shouldApply({linkify: false, hasComponents: false})).toBeFalsy();
			});

			test('false if linkify and hasComponents', () => {
				expect(Linkify.shouldApply({linkify: true, hasComponents: true})).toBeFalsy();
			});
		});
	});

	describe('no links', () => {
		test('does not modify text', () => {
			const text = 'Test Text';

			const {getByTestId} = render(<Linkify text={text}><Inner /></Linkify>);
			const node = getByTestId(TEST_ID);

			expect(node.textContent).toEqual(text);
			expect(node.dataset.hasmarkup).toBeUndefined();
		});

		test('passes hasMarkup through', () => {
			const text = 'Test Text';

			const {getByTestId} = render(<Linkify text={text} hasMarkup><Inner /></Linkify>);
			const node = getByTestId(TEST_ID);

			expect(node.dataset.hasmarkup).toEqual('true');
		});
	});

	describe('links', () => {
		test('preserves before and after link', () => {
			const beforeText = 'before link';
			const afterText = 'after link';
			const href = 'http://www.google.com/';
			const text = `<span class="before">${beforeText}</span> ${href} <span class="after">${afterText}</span>`;

			const {getByTestId} = render(<Linkify text={text}><Inner /></Linkify>);
			const node = getByTestId(TEST_ID);

			const before = node.querySelector('.before');
			const after = node.querySelector('.after');

			expect(before.textContent).toEqual(beforeText);
			expect(after.textContent).toEqual(afterText);
		});

		test('adds correct anchor attributes', () => {
			const href = 'http://www.google.com/';

			const {getByTestId} = render(<Linkify text={href}><Inner /></Linkify>);
			const node = getByTestId(TEST_ID);

			const anchor = node.querySelector('a');

			expect(anchor.href).toEqual(href);
			expect(anchor.title).toEqual(href);
		});
	});
});