import AssociationsInterface from './Interface';

export default AssociationsInterface;

export function createInterfaceForActive (active, destinations, onAddTo, onRemoveFrom) {
	return new AssociationsInterface(destinations, active, onAddTo, onRemoveFrom);
}
