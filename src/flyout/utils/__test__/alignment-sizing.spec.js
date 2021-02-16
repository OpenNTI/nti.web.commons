/* eslint-env jest */
import { VERTICAL, MATCH_SIDE } from '../../Constants';
import { ALIGNMENT_SIZINGS } from '../alignment-sizing';

describe('Alignment Sizing', () => {
	describe('Vertical Axis is Primary', () => {
		const SIZINGS = ALIGNMENT_SIZINGS[VERTICAL];

		test('Match Side', () => {
			const size = SIZINGS[MATCH_SIDE]({ width: 200 });

			expect(size.width).toEqual(200);
		});
	});
});
