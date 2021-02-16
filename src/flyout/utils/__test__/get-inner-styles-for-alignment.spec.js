/* eslint-env jest */

import { VERTICAL, ARROW_HEIGHT } from '../../Constants';
import { getInnerStylesForAlignment } from '../get-inner-styles-for-alignment';

describe('getInnerStylesForAlignment', () => {
	test('Max Width Only, No Arrow', () => {
		const styles = getInnerStylesForAlignment(
			{ maxWidth: 50 },
			false,
			VERTICAL
		);

		expect(styles.maxWidth).toEqual('50px');
		expect(styles.maxHeight).toBeFalsy();
	});

	test('Max Width Only, With Arrow', () => {
		const styles = getInnerStylesForAlignment(
			{ maxWidth: 50 },
			true,
			VERTICAL
		);

		expect(styles.maxWidth).toEqual('50px');
		expect(styles.maxHeight).toBeFalsy();
	});

	test('Max Height Only, No Arrow', () => {
		const styles = getInnerStylesForAlignment(
			{ maxHeight: 50 },
			false,
			VERTICAL
		);

		expect(styles.maxWidth).toBeFalsy();
		expect(styles.maxHeight).toEqual('50px');
	});

	test('Max Height Only, With Arrow', () => {
		const styles = getInnerStylesForAlignment(
			{ maxHeight: 50 },
			true,
			VERTICAL
		);

		expect(styles.maxWidth).toBeFalsy();
		expect(styles.maxHeight).toEqual(`${50 - ARROW_HEIGHT}px`);
	});

	test('Max Height and Max Width, No Arrow', () => {
		const styles = getInnerStylesForAlignment(
			{ maxHeight: 50, maxWidth: 50 },
			false,
			VERTICAL
		);

		expect(styles.maxWidth).toEqual('50px');
		expect(styles.maxHeight).toEqual('50px');
	});

	test('Max Height and Max Width, with Arrow', () => {
		const styles = getInnerStylesForAlignment(
			{ maxHeight: 50, maxWidth: 50 },
			true,
			VERTICAL
		);

		expect(styles.maxWidth).toEqual('50px');
		expect(styles.maxHeight).toEqual(`${50 - ARROW_HEIGHT}px`);
	});
});
