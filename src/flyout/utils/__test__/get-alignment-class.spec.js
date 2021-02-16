/* eslint-env jest */
import {
	ALIGN_TOP,
	ALIGN_BOTTOM,
	ALIGN_LEFT,
	ALIGN_RIGHT,
	ALIGN_CENTER,
} from '../../Constants';
import { getAlignmentClass } from '../get-alignment-class';

describe('getAlignmentClass', () => {
	test('Bottom Left', () => {
		const cls = getAlignmentClass(
			{ top: 50, left: 50 },
			ALIGN_TOP,
			ALIGN_LEFT
		);

		expect(cls).toEqual('bottom left');
	});

	test('Bottom Centered', () => {
		const cls = getAlignmentClass(
			{ top: 50, left: 50 },
			ALIGN_BOTTOM,
			ALIGN_CENTER
		);

		expect(cls).toEqual('bottom center');
	});

	test('Bottom Right', () => {
		const cls = getAlignmentClass(
			{ top: 50, right: 50 },
			ALIGN_BOTTOM,
			ALIGN_RIGHT
		);

		expect(cls).toEqual('bottom right');
	});

	test('Bad Inputs', () => {
		const cls = getAlignmentClass({}, '', 'junk');

		expect(cls).toEqual('');
	});
});
