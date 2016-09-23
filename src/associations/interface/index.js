import minWait, {SHORT} from 'nti-commons/lib/wait-min';

import AssociationsInterface from './Interface';
import {groupItemsByParent} from './utils';

export default AssociationsInterface;

function createItem (item, onAddTo, onRemoveFrom) {
	return AssociationsInterface.createItem(item, onAddTo, onRemoveFrom);
}

export function createInterfaceForActive (active, destinations, onAddTo, onRemoveFrom) {
	return new AssociationsInterface(destinations.map(x => createItem(x, onAddTo, onRemoveFrom)), active, onAddTo, onRemoveFrom);
}


export function createGroupedInterfaceForItem (item, scope, accepts) {
	const provider = item.getPlacementProvider(scope, accepts);
	const associations = new AssociationsInterface(null, null);

	function onAddTo (container, association) {
		return provider.placeIn(container)
			.then(minWait(SHORT))
			.then(() => {
				associations.addActive(association || container);
			});
	}

	function onRemoveFrom (container, association) {
		return provider.removeFrom(container)
			.then(minWait(SHORT))
			.then(() => {
				debugger;
			});
	}

	Promise.all([
		item.getAssociations(),
		provider.getItems()
	]).then((results) => {
		const active = results[0];
		const items = results[1];

		associations.active = active;
		associations.destinations = groupItemsByParent(items.map(x => createItem(x, onAddTo, onRemoveFrom)));
	});

	return associations;
}
