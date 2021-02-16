/* eslint-env jest */
import { constrainAlignment } from '../constrain-alignment';

const viewSize = { height: 1000, width: 1000 };

describe('Constrain Alignment', () => {
	test('No args', () => expect(constrainAlignment()).toEqual({}));

	describe('Constraining sets maxWidth', () => {
		test('Aligned with top', () => {
			const constraint = constrainAlignment({ top: 500 }, viewSize);

			expect(constraint.maxHeight).toEqual(500); //1000 - 500
		});

		test('Aligned with bottom', () => {
			const constraint = constrainAlignment({ bottom: 500 }, viewSize);

			expect(constraint.maxHeight).toEqual(500);
		});

		test('Aligned with left', () => {
			const constraint = constrainAlignment({ left: 500 }, viewSize);

			expect(constraint.maxWidth).toEqual(500);
		});

		test('Aligned with right', () => {
			const constraint = constrainAlignment({ right: 500 }, viewSize);

			expect(constraint.maxWidth).toEqual(500);
		});
	});
});
