import EventEmitter from 'events';

const ACTIVE_MAP = Symbol('Active Associations');
const DESTINATIONS = Symbol('Destinations');

const ADD_TO = Symbol('Add Association');
const REMOVE_FROM = Symbol('Remove Association');

function createActiveMap (active) {
	return active.map((acc, item) => {
		if (item.NTIID != null) {
			acc[item.NTIID] = true;
		} else if (typeof item === 'string') {
			acc[item] = true;
		}

		return acc;
	}, {});
}

export default class AssociationsInterface extends EventEmitter {
	/**
	 * Create an interface to deal with creating and removing associations
	 *
	 * @param  {Object[]} destinations    the list of all destinations associations to show
	 * @param  {Object[]|String[]} active       the list of active associations, should be a subset of the destinations associations,
	 *                                        can be a string of IDs matching records in the destinations associations
	 * @param  {Function} onAddTo   a function that creates an association, and returns a promise
	 * @param  {Function} onRemoveFrom a function that removes an association, and returns a promise
	 * @return {Object}              an AssociationsInterface
	 */
	constructor (destinations, active, onAddTo, onRemoveFrom) {
		super();

		const defaultHandler = () => Promise.reject();

		this[ACTIVE_MAP] = createActiveMap(active);
		this[DESTINATIONS] = destinations;

		this[ADD_TO] = onAddTo || defaultHandler;
		this[REMOVE_FROM] = onRemoveFrom || defaultHandler;
	}


	get isLoading () {
		const {destinations} = this;

		return !destinations;
	}


	get destinations () {
		return this[DESTINATIONS];
	}


	get used () {
		return this.destinations.filter(x => this.isUsed(x));
	}


	get unused () {
		return this.destinations.filter(x => this.isUnused(x));
	}


	set destinations (destinations) {
		this[DESTINATIONS] = destinations;

		this.emit('changed');
	}


	set active (active) {
		this[ACTIVE_MAP] = createActiveMap(active);

		this.emit('changed');
	}


	isUsed (association) {
		const activeMap = this[ACTIVE_MAP];

		return activeMap[association.NTIID || association.ID];
	}


	isUnused (association) {
		return !this.isUsed(association);
	}


	createAssociation (association) {

	}


	removeAssociation (association) {

	}
}


export function createInterfaceForRecord (record, destinations, onAddTo, onRemoveFrom) {

}


export function createInterfaceForActive (active, destinations, onAddTo, onRemoveFrom) {
	return new AssociationsInterface(destinations, active, onAddTo, onRemoveFrom);
}
