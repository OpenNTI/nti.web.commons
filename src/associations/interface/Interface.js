import EventEmitter from 'events';
import {groupDestinations, mapActive, flattenGroups, filterGroups} from './utils';
import Group from './Group';
import Item from './Item';

const DESTINATIONS = Symbol('ASSOCIATIONS DESTINATIONS');
const RAW_ACTIVE = Symbol('RAW ACTIVE DESTINATIONS');
const ACTIVE_MAP = Symbol('ACTIVE DESTINATIONS');
const SHARED_WITH = Symbol('SHARED ASSOCIATIONS');
const AVAILABLE = Symbol('UNUSED ASSOCIATIONS');

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


	get isSaving () {
		const {destinations} = this;

		return !destinations;
	}


	get destinations () {
		return this[DESTINATIONS];
	}


	set destinations (destinations) {
		const groups = groupDestinations(destinations);

		this[DESTINATIONS] = groups;

		this[SHARED_WITH] = new Group('', flattenGroups(groups.map(group => group.filter(x => this.isUsed(x)))));
		this[AVAILABLE] = groups.map(group => group.filter(x => !this.isUsed(x)));

		this.emit('changed');
	}


	set active (active) {
		this[RAW_ACTIVE] = active;
		this[ACTIVE_MAP] = mapActive(active);

		//Re-set destinations to update the used and unused
		if (this.destinations) {
			this.destinations = this.destinations;
		}

		this.emit('changed');
	}


	get sharedWith () {
		return this[SHARED_WITH];
	}


	get available () {
		return this[AVAILABLE];
	}


	get hasAssociations () {
		return this[RAW_ACTIVE] && this[RAW_ACTIVE].length;
	}


	get isEmpty () {
		const destinations = this[DESTINATIONS];

		return destinations.every(x => x.isEmpty);
	}


	isUsed (association) {
		const activeMap = this[ACTIVE_MAP];

		if (!activeMap) { return false; }

		return activeMap[association.NTIID || association.ID];
	}


	filter (fn) {
		const filteredGroups = filterGroups(this.destinations, fn);

		return new AssociationInterface(filteredGroups, this[RAW_ACTIVE]);
	}
}
