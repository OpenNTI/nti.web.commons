/* eslint-env jest */
import Tab from '../Tab';

describe('Tab Config Test', () => {
	describe('getConfigFor', () => {
		test('returns null is hide is truthy', () => {
			expect(Tab.getConfigFor({route: '/path', label: 'label', active: false, hide: true})).toEqual(null);
		});

		test('returns null if label is not a string', () => {
			expect(Tab.getConfigFor({route: '/path', label: null, active: false})).toEqual(null);
		});

		test('returns route, label, and active', () => {
			const config = Tab.getConfigFor({route: '/path/', label: 'label', active: true});

			expect(config.route).toEqual('/path/');
			expect(config.label).toEqual('label');
			expect(config.active).toBeTruthy();
		});
	});
});
