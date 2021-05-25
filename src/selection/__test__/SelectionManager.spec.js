/* eslint-env jest */
import SelectionManager from '../SelectionManager';
import SelectionItem from '../SelectionItem';

//These are all failing now.
describe('Selection Manager tests', () => {
	let selectionManager;
	let listeners;

	beforeEach(() => {
		listeners = {
			changed: () => {},
		};

		jest.spyOn(listeners, 'changed');

		selectionManager = new SelectionManager();

		selectionManager.addListener('selection-changed', listeners.changed);
	});

	test('Select fires selection-changed', () => {
		let item = new SelectionItem({ id: 0 });

		selectionManager.select(item);

		expect(listeners.changed).toHaveBeenCalled();
	});

	test('Selecting the same item more than once only has one selection', () => {
		let item = new SelectionItem({ id: 0 });

		selectionManager.select(item);
		selectionManager.select(item);

		let selection = selectionManager.getSelection();

		expect(selection.length).toEqual(1);
		expect(selection[0].id).toEqual(0);
	});

	test('Selecting with keepSelection keeps the current selection', () => {
		let itemA = new SelectionItem({ id: 0 });
		let itemB = new SelectionItem({ id: 1 });

		selectionManager.select(itemA);
		selectionManager.select(itemB, true);

		let selection = selectionManager.getSelection();

		expect(selection.length).toEqual(2);
	});

	test("Select doesn't fire selection-changed when selecting an item with the same id as a selected one", () => {
		let itemA = new SelectionItem({ id: 0 });
		let itemB = new SelectionItem({ id: 0 });

		selectionManager.select(itemA);
		selectionManager.select(itemB);

		expect(listeners.changed.calls.count()).toEqual(1);
	});

	test('Unselect removes item from selection', () => {
		let itemA = new SelectionItem({ id: 0 });
		let itemB = new SelectionItem({ id: 1 });

		selectionManager.select(itemA);
		selectionManager.select(itemB, true);

		let selection = selectionManager.getSelection();

		expect(selection.length).toEqual(2);

		selectionManager.unselect(itemA);

		selection = selectionManager.getSelection();

		expect(selection.length).toEqual(1);
		expect(selection[0].id).toEqual(1);
	});

	test("Unselect doesn't fire selection changed if nothing selected", () => {
		selectionManager.unselect(new SelectionItem({ id: 0 }));

		expect(listeners.changed.calls.count()).toEqual(0);
	});

	test('Unselect does fire selection changed if unselecting selected item', () => {
		let item = new SelectionItem({ id: 0 });

		selectionManager.select(item);
		selectionManager.unselect(item);

		expect(listeners.changed.calls.count()).toEqual(2);
	});
});
