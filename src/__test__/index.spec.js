import * as ns from '../index';
/* eslint-env jest */
describe('Sanity Checks', () => {

	test ('lol', () => {
		expect(true).toBe(true);
	});

	test('Imports resolve', () => {
		expect(ns).toBeTruthy();
	});
});
