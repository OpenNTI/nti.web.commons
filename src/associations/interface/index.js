import AssociationsInterface from './Interface';

export default AssociationsInterface;

function createItem (item, onAddTo, onRemoveFrom) {
	return AssociationsInterface.createItem(item, onAddTo, onRemoveFrom);
}

export function createInterfaceForActive (active, destinations, onAddTo, onRemoveFrom) {
	return new AssociationsInterface(destinations.map(x => createItem(x, onAddTo, onRemoveFrom)), active, onAddTo, onRemoveFrom);
}
