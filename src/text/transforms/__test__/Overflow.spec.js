/* eslint-env jest */
import Overflow from '../Overflow';

describe('Overflow transform tests', () => {
	describe('statics', () => {
		describe('shouldApply', () => {
			test('true if overflow is non null and not hasComponents', () => {
				expect(
					Overflow.shouldApply({
						overflow: '...',
						hasComponents: false,
					})
				).toBeTruthy();
				expect(
					Overflow.shouldApply({ overflow: '', hasComponents: false })
				).toBeTruthy();
			});

			test('false if overflow is non null and hasComponents', () => {
				expect(
					Overflow.shouldApply({
						overflow: '...',
						hasComponents: true,
					})
				).toBeFalsy();
			});

			test('false if overflow is null and not hasComponents', () => {
				expect(
					Overflow.shouldApply({
						overflow: undefined,
						hasComponents: false,
					})
				).toBeFalsy();
			});
		});
	});
});
