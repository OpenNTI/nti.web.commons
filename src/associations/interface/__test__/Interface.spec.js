/* eslint-env jest */
import Interface from '../Interface';

function makeDestination (id, onAdd, onRemove) {
	return Interface.createItem({ NTIID: id, label: `${id} Label` }, onAdd, onRemove);
}

describe('Association Interface Tests', () => {
	let associations;
	let items;

	const before = () => {
		function onAdd (item) {
			associations.addActive(item);
		}

		function onRemove (item) {
			associations.removeActive(item);
		}

		items = [
			makeDestination('1', onAdd, onRemove),
			makeDestination('2', onAdd, onRemove),
			makeDestination('3', onAdd, onRemove),
			makeDestination('4', onAdd, onRemove),
			makeDestination('5', onAdd, onRemove)
		];

		associations = new Interface(items, [{NTIID: '2'}, {NTIID: '4'}]);
	};

	beforeEach(before);

	describe('Active Association Tests', () => {
		beforeEach(before);

		it('isSharedWith is true for active', () => {
			expect(associations.isSharedWith({NTIID: '2'})).toBeTruthy();
			expect(associations.isSharedWith({NTIID: '4'})).toBeTruthy();
		});

		it('isSharedWith is false for non-active', () => {
			expect(associations.isSharedWith({NTIID: '1'})).toBeFalsy();
			expect(associations.isSharedWith({NTIID: '3'})).toBeFalsy();
			expect(associations.isSharedWith({NTIID: '5'})).toBeFalsy();
		});
	});

	describe('Adding and Removing Associations', () => {
		beforeEach(before);

		it('adding an association makes it active', (done) => {
			const item = items[0];

			function onChange () {
				associations.removeListener('change', onChange);
				expect(associations.isSharedWith(item)).toBeTruthy();
				done();
			}

			associations.addListener('change', onChange);

			expect(associations.isSharedWith(item)).toBeFalsy();

			item.onAddTo(null, associations);
		});

		it('removing an association makes it inactive', (done) => {
			const item = items[1];

			function onChange () {
				associations.removeListener('change', onChange);
				expect(associations.isSharedWith(item)).toBeFalsy();
				done();
			}

			associations.addListener('change', onChange);

			expect(associations.isSharedWith(item)).toBeTruthy();

			item.onRemoveFrom();
		});
	});
});
