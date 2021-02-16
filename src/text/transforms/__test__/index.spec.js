/* eslint-env jest */
import { getTransforms } from '../index';
import LimitLines from '../LimitLines';
import Linkify from '../Linkify';
import Overflow from '../Overflow';

describe('getTransform tests', () => {
	test('empty array if no transforms apply', () => {
		const transforms = getTransforms({ hasComponents: true });

		expect(transforms.length).toBe(0);
	});

	test('returns linkify before overflow', () => {
		const transforms = getTransforms({ linkify: true, overflow: '...' });

		expect(transforms.indexOf(Linkify)).toBeLessThan(
			transforms.indexOf(Overflow)
		);
	});

	test('returns linkify before limit-lines', () => {
		const transforms = getTransforms({ linkify: true, limitLines: 2 });

		expect(transforms.indexOf(Linkify)).toBeLessThan(
			transforms.indexOf(LimitLines)
		);
	});

	test('returns limit-lines before overflow', () => {
		const transforms = getTransforms({ overflow: '...', limitLines: 2 });

		expect(transforms.indexOf(LimitLines)).toBeLessThan(
			transforms.indexOf(Overflow)
		);
	});
});
