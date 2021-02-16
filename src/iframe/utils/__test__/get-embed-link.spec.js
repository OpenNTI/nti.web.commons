/* eslint-env jest */
import getEmbedLink from '../get-embed-link';

describe('getEmbedLink tests', () => {
	test('no format or config', () => {
		const src = 'http://www.test.pdf';

		expect(getEmbedLink(src)).toEqual(src);
	});

	test('format with no config', () => {
		const src = 'http://www.test.pdf';
		const format = 'application/pdf';

		expect(getEmbedLink(src, null, format)).toEqual(
			'http://www.test.pdf?format=application%2Fpdf'
		);
	});

	test('config with no format', () => {
		const src = 'http://www.test.pdf';
		const config = { foo: 0, bar: 'vw' };

		expect(getEmbedLink(src, config, null)).toEqual(
			'http://www.test.pdf#foo=0&bar=vw'
		);
	});

	test('config and format', () => {
		const src = 'http://www.test.pdf';
		const config = { foo: 0, bar: 'vw' };
		const format = 'application/pdf';

		expect(getEmbedLink(src, config, format)).toEqual(
			'http://www.test.pdf?format=application%2Fpdf#foo=0&bar=vw'
		);
	});
});
