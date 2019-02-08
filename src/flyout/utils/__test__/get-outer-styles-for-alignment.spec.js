/* eslint-env jest */
import {
	VERTICAL,
} from '../../Constants';
import { getOuterStylesForAlignment } from '../get-outer-styles-for-alignment';

describe('getOuterStylesForAlignment', () => {
	test('gets proper styles', () => {
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

		expect(styles).toEqual({
			top:'50px',
			bottom:'50px',
			left:'50px',
			right:'50px',
			width:'50px',
		});

		expect(getOuterStylesForAlignment({ bottom: 50, left: 50 }, true, VERTICAL, true)).toEqual({
			bottom: '65px',
			left: '27px',
		});

		expect(getOuterStylesForAlignment({ top: 50, right: 50 }, true, VERTICAL, true)).toEqual({
			top: '65px',
			right: '27px',
		});

		expect(getOuterStylesForAlignment({ top: 50 }, true, VERTICAL, true)).toEqual({
			top: '65px',
		});
	});


	test('No Arguments', () => expect(getOuterStylesForAlignment()).toEqual({}));
});
