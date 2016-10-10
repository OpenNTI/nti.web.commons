import {wait} from 'nti-commons';

import AssociationsInterface from './Interface';
import {groupItemsByParent} from './utils';


export default AssociationsInterface;

function createItem (item, onAddTo, onRemoveFrom) {
	return AssociationsInterface.createItem(item, onAddTo, onRemoveFrom);
}

export function createInterfaceForActive (active, destinations, onAddTo, onRemoveFrom) {
	return new AssociationsInterface(destinations.map(x => createItem(x, onAddTo, onRemoveFrom)), active, onAddTo, onRemoveFrom);
}


export function createInterfaceForItem (item, scope, accepts, group) {
	const provider = item.getPlacementProvider(scope);
	const associations = new AssociationsInterface(null, null);

	function onAddTo (container, association) {
		return provider.placeIn(container)
			.then(wait.min(wait.SHORT))
			.then(() => {
				associations.addActive(association || container);
			});
	}


	function onRemoveFrom (container, association) {
		return provider.removeFrom(container)
			.then(wait.min(wait.SHORT))
			.then(() => {
				associations.removeActive(association || container);
			});
	}


	function parseItems (items) {
		const parsed = items.map(x => createItem(x, onAddTo, onRemoveFrom));

		return group ? groupItemsByParent(parsed) : parsed;
	}


	Promise.all([
		item.getAssociations(accepts),
		provider.getItems(accepts)
	]).then((results) => {
		const active = results[0];
		const items = results[1];

		associations.active = active || [];
		associations.destinations = parseItems(items);
	});

	return associations;
}


export function createGroupedInterfaceForItem (item, scope, accepts) {
	return createInterfaceForItem (item, scope, accepts, true);
}
