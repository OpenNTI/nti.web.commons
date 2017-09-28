/* eslint-env jest */

import getOuterStylesForAlignment from '../get-outer-styles-for-alignment';

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

		expect(styles.top).toEqual('50px');
		expect(styles.bottom).toEqual('50px');
		expect(styles.left).toEqual('50px');
		expect(styles.right).toEqual('50px');
		expect(styles.width).toEqual('50px');
	});
});
