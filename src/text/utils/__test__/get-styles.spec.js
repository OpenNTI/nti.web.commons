/* eslint-env jest */
import getStyles from '../get-styles';
import {mockComputedStyle} from '../../__test__/utils';

describe('getStyles tests', () => {
	describe('padding', () => {
		const PADDING_TOP = 10;
		const PADDING_BOTTOM = 20;

		mockComputedStyle({'padding-top': `${PADDING_TOP}px`, 'padding-bottom': `${PADDING_BOTTOM}px`});

		test('returns only style that was asked for', () => {
			expect(getStyles(void 0, ['paddingTop']).paddignBottom).toBeUndefined();
			expect(getStyles(void 0, ['paddingBottom']).paddingTop).toBeUndefined();
		});

		test('returns paddingTop', () => {
			const styles = getStyles(void 0, ['paddingTop']);

			expect(styles.paddingTop).toEqual(PADDING_TOP);
			expect(styles.paddingBottom).toBeUndefined();
		});

		test('returns paddingBottom',  () => {
			const styles = getStyles(void 0, ['paddingBottom']);

			expect(styles.paddingTop).toBeUndefined();
			expect(styles.paddingBottom).toEqual(PADDING_BOTTOM);
		});

		test('returns paddingTop and paddingBottom', () => {
			const styles = getStyles(void 0, ['paddingTop', 'paddingBottom']);

			expect(styles.paddingTop).toEqual(PADDING_TOP);
			expect(styles.paddingBottom).toEqual(PADDING_BOTTOM);
		});
	});

	describe('lineHeight', () => {
		const LINE_HEIGHT = 18;

		mockComputedStyle({'lineHeight': `${LINE_HEIGHT}px`});

		test('returns lineHeight', () => {
			const styles = getStyles(void 0, ['lineHeight']);

			expect(styles.lineHeight).toEqual(LINE_HEIGHT);
		});
	});
});