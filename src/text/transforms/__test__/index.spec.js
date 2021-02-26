/* eslint-env jest */
import { getTransforms } from '../index';
import LimitLines from '../LimitLines';
import Linkify from '../Linkify';

describe('getTransform tests', () => {
	test('empty array if no transforms apply', () => {
		const transforms = getTransforms({ hasComponents: true });

		expect(transforms.length).toBe(0);
	});

	test('returns linkify before limit-lines', () => {
		const transforms = getTransforms({ linkify: true, limitLines: 2 });

		expect(transforms.indexOf(Linkify)).toBeLessThan(
			transforms.indexOf(LimitLines)
		);
	});
});
