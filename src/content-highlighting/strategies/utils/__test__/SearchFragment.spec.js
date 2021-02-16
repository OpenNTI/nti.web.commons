/* eslint-env jest */
import { contentRegexFromSearchTerm } from '../SearchFragment';

describe('contentRegexFromSearchTerm', () => {
	test('Deals with funky unicode equality', () => {
		const content = 'Court\u0027s';
		const term = "Court's";
		const re = contentRegexFromSearchTerm(term);

		expect(new RegExp(re, 'ui').test(content)).toBeTruthy();
	});

	test("Non-phrase doesn't span space", () => {
		const content = 'sand which';
		const term = 'sandwhich';
		const re = contentRegexFromSearchTerm(term);

		expect(new RegExp(re, 'ui').test(content)).toBeFalsy();
	});

	test('Phrase search ignores punctuation', () => {
		const content = 'were, did? Court\u0027s belong!';
		const term = "were did Court's belong?";
		const re = contentRegexFromSearchTerm(term, true);

		expect(new RegExp(re, 'ui').test(content)).toBeTruthy();
	});

	test('Allows phrase search to span ?', () => {
		const content = 'beef? chicken';
		const term = 'beef chicken';
		const re = contentRegexFromSearchTerm(term, true);

		expect(new RegExp(re, 'ui').test(content)).toBeTruthy();
	});

	test('checks a long phrase search', () => {
		const content =
			'to shareholders, how to apply what little I\u0027d learned about management to the business of the company, how to maintain editorial quality while exercising financial';
		const term =
			"to shareholders how to apply what little I'd learned about management to the business of the company how to maintain editorial quality while exercising financial";
		const re = contentRegexFromSearchTerm(term, true);

		expect(new RegExp(re, 'ui').test(content)).toBeTruthy();
	});

	test('Survives punctuation that are regex special chars', () => {
		const content =
			'of basketball have developed for casual play. Competitive basketball is primarily an indoor sport played';
		const re = contentRegexFromSearchTerm(content, true);

		expect(new RegExp(re, 'ui').test(content)).toBeTruthy();
	});
});

describe('contentRegexForFragment', () => {
	test.todo('contentRegexForFragment works');
});
