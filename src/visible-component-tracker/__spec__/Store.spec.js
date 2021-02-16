/* eslint-env jest */
import Store from '../Store';

describe('Visible Component Tracker Store', () => {
	describe('Statics', () => {
		describe('getInstanceFor', () => {
			test('returns the same instance for the same group', () => {
				expect(Store.getInstanceFor('group')).toEqual(
					Store.getInstanceFor('group')
				);
			});

			test('returns different instances for different groups', () => {
				expect(Store.getInstanceFor('group')).not.toEqual(
					Store.getInstanceFor('different-group')
				);
			});
		});

		describe('addGroupListener', () => {
			test('calls listener a store exists for that group', () => {
				const listener = jest.fn();

				Store.getInstanceFor('listener-group-exists');
				Store.addGroupListener('listener-group-exists', listener);

				expect(listener.mock.calls.length).toBe(1);
			});

			test('does not call listener if the store does not exist for that group', () => {
				const listener = jest.fn();

				Store.addGroupListener(
					'listener-group-does-not-exists',
					listener
				);

				expect(listener.mock.calls.length).toBe(0);
			});
		});
	});
});
