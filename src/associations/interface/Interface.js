import EventEmitter from 'events';
import {groupDestinations, mapActive, flattenGroups, filterGroups} from './utils';
import Group from './Group';
import Item from './Item';

const DESTINATIONS = Symbol('ASSOCIATIONS DESTINATIONS');
const ACTIVE = Symbol('ACTIVE ASSOCIATIONS');
const RAW_ACTIVE = Symbol('RAW ACTIVE DESTINATIONS');
const ACTIVE_MAP = Symbol('ACTIVE DESTINATIONS');
const CLONE = Symbol('Clone Interface');

/**
 * Make this a class so any subsequent interfaces from filtering can share a common
 * instance to keep track of the active associations.
 */
class ActiveInterface extends EventEmitter {
	/**
	 * Create an ActiveInterface
	 * @param  {[String]} active the list of active IDs
	 * @return {Object}        the Active Interface
	 */
	constructor (active) {
		super();

		this.active = active;
	}

	isActiveInterface = true

	set active (active) {
		if (active.isActiveInterface) {
			active = active.active;
		}

		this[RAW_ACTIVE] = active;
		this[ACTIVE_MAP] = mapActive(active || []);

		this.emit('change');
	}


	isSharedWith (association) {
		const activeMap = this[ACTIVE_MAP];

		return activeMap && activeMap[association.NTIID || association.ID];
	}


	hasAssociations () {
		return this[RAW_ACTIVE] && this[RAW_ACTIVE].length > 0;
	}


	add (association) {
		const id = association.NTIID || association.ID;
		const activeMap = this[ACTIVE_MAP];
		let active = this[RAW_ACTIVE];

		if (!activeMap[id]) {
			active.push(id);
			this.active = active;
		}
	}


	remove (association) {
		const id = association.NTIID || association.ID;
		const activeMap = this[ACTIVE_MAP];
		const active = this[RAW_ACTIVE];

		if (activeMap[id]) {
			this.active = active.filter(x => x !== id);
		}
	}
}

export default class AssociationInterface extends EventEmitter {
	static createItem (item, onAddTo, onRemoveFrom, cfg) {
		return new Item(item, onAddTo, onRemoveFrom, cfg);
	}

	static createGroup (label, items) {
		return new Group(label, items);
	}

	constructor (destinations, active) {
		super();

		if (active) {
			this.active = active;
		}

		if (destinations) {
			this.destinations = destinations;
		}
	}


	onChanged () {
		this.emit('change', this);
	}


	get isLoading () {
		const {destinations} = this;

		return !destinations;
	}


	get destinations () {
		return this[DESTINATIONS];
	}


	set destinations (destinations) {
		const groups = groupDestinations(destinations);

		this[DESTINATIONS] = groups;

		this.onChanged();
	}


	set active (active) {
		if (this[ACTIVE]) {
			this[ACTIVE].active = active;
		} else {
			if (active.isActiveInterface) {
				this[ACTIVE] = active;
			} else {
				this[ACTIVE] = new ActiveInterface(active);
			}

			this[ACTIVE].addListener('change', () => this.onChanged());
		}

		this.onChanged();
	}


	addActive (active) {
		if (this[ACTIVE]) {
			this[ACTIVE].add(active);
		} else {
			this.active = [active];
		}
	}


	removeActive (active) {
		if (this[ACTIVE]) {
			this[ACTIVE].remove(active);
		}
	}


	get hasSharedWith () {
		return this[ACTIVE] && this[ACTIVE].hasAssociations();
	}


	get isEmpty () {
		const destinations = this[DESTINATIONS];

		return destinations.every(x => x.isEmpty);
	}


	isSharedWith (association) {
		return this[ACTIVE] && this[ACTIVE].isSharedWith(association);
	}


	[CLONE] (destinations) {
		return new AssociationInterface(destinations, this[ACTIVE]);
	}


	filter (fn) {
		const filteredGroups = filterGroups(this.destinations || [], fn);

		return this[CLONE](filteredGroups);
	}


	flatten () {
		const flattenedGroups = flattenGroups(this.destinations || []);

		return this[CLONE](flattenedGroups);
	}
}
