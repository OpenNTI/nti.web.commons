/* eslint-env jest */

import {
	VERTICAL,

	ALIGN_TOP,
	ALIGN_BOTTOM,
	ALIGN_LEFT,
	ALIGN_RIGHT,
	ALIGN_LEFT_OR_RIGHT,
	ALIGN_CENTER,

	DEFAULT_VERTICAL
} from '../../Constants';
import ALIGNMENT_POSITIONS from '../alignment-positions';

const viewSize = {height: 1000, width: 1000};

describe('Alignment Positions', () => {
	const flyout = {offsetHeight: 250, offsetWidth: 250};

	describe('Vertical Axis is Primary', () => {
		const ALIGNMENTS = ALIGNMENT_POSITIONS[VERTICAL];

		describe('Vertical Alignments', () => {
			test('Forced Top Alignment', () => {
				const position = ALIGNMENTS[ALIGN_TOP]({top: 500}, flyout, viewSize);

				//The flyout should be be positioned by bottom to be at the top of the trigger,
				//so it can grow upwards.
				expect(position.top).toEqual(null);
				expect(position.bottom).toEqual(500);
			});

			test('Forced Bottom Alignment', () => {
				const position = ALIGNMENTS[ALIGN_BOTTOM]({bottom: 500}, flyout, viewSize);

				//THe flyout should be positioned by top to be at the bottom of the trigger,
				//so it can grow downwards.
				expect(position.top).toEqual(500);
				expect(position.bottom).toEqual(null);
			});

			test('Default enough room on bottom', () => {
				const position = ALIGNMENTS[DEFAULT_VERTICAL]({top: 5, bottom: 45}, flyout, viewSize);

				expect(position.top).toEqual(45);
				expect(position.bottom).toEqual(null);
			});

			test('Default enough room on top', () => {
				const position = ALIGNMENTS[DEFAULT_VERTICAL]({top: 955, bottom: 995}, flyout, viewSize);

				expect(position.top).toEqual(null);
				expect(position.bottom).toEqual(45);
			});

			test('Default more room on the bottom', () => {
				const position = ALIGNMENTS[DEFAULT_VERTICAL]({top: 5, bottom: 45}, flyout, viewSize);

				expect(position.top).toEqual(45);
				expect(position.bottom).toEqual(null);
			});

			test('Default more room on the top', () => {
				const position = ALIGNMENTS[DEFAULT_VERTICAL]({top: 200, bottom: 995}, flyout, viewSize);

				expect(position.top).toEqual(null);
				expect(position.bottom).toEqual(800);
			});
		});

		describe('Horizontal Alignments', () => {
			test('Left Alignment', () => {
				const position = ALIGNMENTS[ALIGN_LEFT]({left: 45}, flyout, viewSize);

				expect(position.left).toEqual(45);
				expect(position.right).toEqual(null);
			});

			test('Right Alignment', () => {
				const position = ALIGNMENTS[ALIGN_RIGHT]({right: 955}, flyout, viewSize);

				expect(position.left).toEqual(null);
				expect(position.right).toEqual(45);
			});

			describe('Left Or Right Alignment', () => {
				test('More space to the left', () => {
					const position = ALIGNMENTS[ALIGN_LEFT_OR_RIGHT]({left: 850, right: 950}, {width: 100}, viewSize);

					expect(position.left).toEqual(null);
					expect(position.right).toEqual(50);
				});

				test('More space to the right', () => {
					const position = ALIGNMENTS[ALIGN_LEFT_OR_RIGHT]({left: 50, right: 150}, {width: 100}, viewSize);

					expect(position.left).toEqual(50);
					expect(position.right).toEqual(null);
				});
			});

			test('Center Alignment, Trigger wider', () => {
				const position = ALIGNMENTS[ALIGN_CENTER]({left: 45, width: 450}, flyout, viewSize);

				expect(position.left).toEqual(145);
				expect(position.right).toEqual(null);
			});

			test('Center Alignment, Trigger narrower', () => {
				const position = ALIGNMENTS[ALIGN_CENTER]({left: 45, width: 200}, flyout, viewSize);

				expect(position.left).toEqual(20);
				expect(position.right).toEqual(null);
			});

			test('Default', () => {
				//For now this just calls center alignment so no need to test it
				expect(true).toBeTruthy();
			});
		});
	});
});
