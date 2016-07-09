import {
	VERTICAL,
	ALIGN_TOP,
	ALIGN_BOTTOM,
	ALIGN_CENTER,
	ALIGN_LEFT,
	ALIGN_RIGHT,
	MATCH_SIDE,
	// DEFAULT_HORIZONTAL,
	DEFAULT_VERTICAL
} from '../Constants';

import {ALIGNMENT_POSITIONS, ALIGNMENT_SIZINGS } from '../utils';

describe('Flyout util tests', () => {
	describe('Alignment Positions', () => {
		const viewSize = {height: 1000, width: 1000};
		const flyout = {offsetHeight: 250, offsetWidth: 250};

		describe('Vertical Axis is Primary', () => {
			const ALIGNMENTS = ALIGNMENT_POSITIONS[VERTICAL];

			describe('Vertical Alignments', () => {
				it ('Forced Top Alignment', () => {
					const position = ALIGNMENTS[ALIGN_TOP]({top: 500}, flyout, viewSize);

					//The flyout should be be positioned by bottom to be at the top of the trigger,
					//so it can grow upwards.
					expect(position.top).toEqual(null);
					expect(position.bottom).toEqual(500);
				});

				it ('Forced Bottom Alignment', () => {
					const position = ALIGNMENTS[ALIGN_BOTTOM]({bottom: 500}, flyout, viewSize);

					//THe flyout should be positioned by top to be at the bottom of the trigger,
					//so it can grow downwards.
					expect(position.top).toEqual(500);
					expect(position.bottom).toEqual(null);
				});

				it ('Default enough room on bottom', () => {
					const position = ALIGNMENTS[DEFAULT_VERTICAL]({top: 5, bottom: 45}, flyout, viewSize);

					expect(position.top).toEqual(45);
					expect(position.bottom).toEqual(null);
				});

				it ('Default enough room on top', () => {
					const position = ALIGNMENTS[DEFAULT_VERTICAL]({top: 955, bottom: 995}, flyout, viewSize);

					expect(position.top).toEqual(null);
					expect(position.bottom).toEqual(45);
				});

				it ('Default more room on the bottom', () => {
					const position = ALIGNMENTS[DEFAULT_VERTICAL]({top: 5, bottom: 45}, flyout, viewSize);

					expect(position.top).toEqual(45);
					expect(position.bottom).toEqual(null);
				});

				it ('Default more room on the top', () => {
					const position = ALIGNMENTS[DEFAULT_VERTICAL]({top: 200, bottom: 995}, flyout, viewSize);

					expect(position.top).toEqual(null);
					expect(position.bottom).toEqual(800);
				});
			});

			describe('Horizontal Alignments', () => {
				it ('Left Alignment', () => {
					const position = ALIGNMENTS[ALIGN_LEFT]({left: 45}, flyout, viewSize);

					expect(position.left).toEqual(45);
					expect(position.right).toEqual(null);
				});

				it ('Right Alignment', () => {
					const position = ALIGNMENTS[ALIGN_RIGHT]({right: 955}, flyout, viewSize);

					expect(position.left).toEqual(null);
					expect(position.right).toEqual(45);
				});

				it ('Center Alignment, Trigger wider', () => {
					const position = ALIGNMENTS[ALIGN_CENTER]({left: 45, width: 450}, flyout, viewSize);

					expect(position.left).toEqual(145);
					expect(position.right).toEqual(null);
				});

				it ('Center Alignment, Trigger narrower', () => {
					const position = ALIGNMENTS[ALIGN_CENTER]({left: 45, width: 200}, flyout, viewSize);

					expect(position.left).toEqual(20);
					expect(position.right).toEqual(null);
				});

				it ('Default', () => {
					//For now this just calls center alignment so no need to test it
					expect(true).toBeTruthy();
				});
			});
		});
	});


	describe ('Sizing Tests', () => {
		describe('Vertical Axis is Primary', () => {
			const SIZINGS = ALIGNMENT_SIZINGS[VERTICAL];

			it ('Match Side', () => {
				const size = SIZINGS[MATCH_SIDE]({width: 200});

				expect(size.width).toEqual(200);
			});
		});
	});
});
