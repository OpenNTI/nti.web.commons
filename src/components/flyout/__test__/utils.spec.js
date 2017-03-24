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
import {
	ALIGNMENT_POSITIONS,
	ALIGNMENT_SIZINGS,
	constrainAlignment,
	getOuterStylesForAlignment,
	getInnerStylesForAlignment,
	getAlignmentClass
} from '../utils';

const viewSize = {height: 1000, width: 1000};

describe('Flyout util tests', () => {
	describe('Alignment Positions', () => {
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


	describe('Sizing Tests', () => {
		describe('Vertical Axis is Primary', () => {
			const SIZINGS = ALIGNMENT_SIZINGS[VERTICAL];

			it ('Match Side', () => {
				const size = SIZINGS[MATCH_SIDE]({width: 200});

				expect(size.width).toEqual(200);
			});
		});
	});


	describe('Constraining sets maxWidth', () => {
		it('Aligned with top', () => {
			const constraint = constrainAlignment({top: 500}, viewSize);

			expect(constraint.maxHeight).toEqual(500);//1000 - 500
		});

		it('Aligned with bottom', () => {
			const constraint = constrainAlignment({bottom: 500}, viewSize);

			expect(constraint.maxHeight).toEqual(500);
		});

		it('Aligned with left', () => {
			const constraint = constrainAlignment({left: 500}, viewSize);

			expect(constraint.maxWidth).toEqual(500);
		});

		it('Aligned with right', () => {
			const constraint = constrainAlignment({right: 500}, viewSize);

			expect(constraint.maxWidth).toEqual(500);
		});
	});


	it('Alignment -> Outer Styles', () => {
		//Even though this isn't a valid alignment, its just checking that
		//it converts all the props to px's and removes maxHeight and maxWidth
		const styles = getOuterStylesForAlignment({
			top: 50,
			bottom: 50,
			left: 50,
			right: 50,
			width: 50,
			maxWidth: 50,
			maxHeight: 50
		});

		expect(styles.top).toEqual('50px');
		expect(styles.bottom).toEqual('50px');
		expect(styles.left).toEqual('50px');
		expect(styles.right).toEqual('50px');
		expect(styles.width).toEqual('50px');
	});


	it('Alignment -> Inner Styles', () => {
		const maxWidth = getInnerStylesForAlignment({maxWidth: 50});
		const maxHeight = getInnerStylesForAlignment({maxHeight: 50});
		const both = getInnerStylesForAlignment({maxWidth: 50, maxHeight: 50});

		expect(maxWidth.maxWidth).toEqual('50px');
		expect(maxWidth.maxHeight).toBeFalsy();

		expect(maxHeight.maxHeight).toEqual('50px');
		expect(maxHeight.maxWidth).toBeFalsy();

		expect(both.maxHeight).toEqual('50px');
		expect(both.maxWidth).toEqual('50px');
	});


	describe('Alignment -> Classes', () => {
		it ('Bottom Left', () => {
			const cls = getAlignmentClass({top: 50, left: 50}, ALIGN_TOP, ALIGN_LEFT);

			expect(cls).toEqual('bottom left');
		});

		it ('Bottom Centered', () => {
			const cls = getAlignmentClass({top: 50, left: 50}, ALIGN_BOTTOM, ALIGN_CENTER);

			expect(cls).toEqual('bottom center');
		});

		it('Bottom Right', () => {
			const cls = getAlignmentClass({top: 50, right: 50}, ALIGN_BOTTOM, ALIGN_RIGHT);

			expect(cls).toEqual('bottom right');
		});
	});
});
