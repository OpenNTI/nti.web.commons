import EventEmitter from 'events';

import {groupDestinations, flattenGroups, filterGroups} from './utils';
import Group from './Group';
import Item from './Item';

const DESTINATIONS = Symbol('ASSOCIATIONS DESTINATIONS');
const ACTIVE = Symbol('ACTIVE ASSOCIATIONS');
const RAW_ACTIVE = Symbol('RAW ACTIVE DESTINATIONS');
const CLONE = Symbol('Clone Interface');

/**
 * Make this a class so any subsequent interfaces from filtering can share a common
 * instance to keep track of the active associations.
 */
class ActiveInterface extends EventEmitter {
	/**
	 * Create an ActiveInterface
	 * @param  {Object} active the list of active IDs
	 * @returns {Object}        the Active Interface
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

		this[RAW_ACTIVE] = (active || []);

		this.emit('change');
	}


	getAssociationFor (item) {
		const itemID = item.NTIID || item.ID;
		const activeItems = this[RAW_ACTIVE];

		for (let active of activeItems) {
			let activeID = active.NTIID || active.ID;

			if (itemID === activeID) {
				return active;
			}
		}
	}


	hasAssociations () {
		return this[RAW_ACTIVE] && this[RAW_ACTIVE].length > 0;
	}


	add (item) {
		let active = this[RAW_ACTIVE];

		if (!this.getAssociationFor(item)) {
			active.push(item);
			this.active = active;
		}
	}


	remove (item) {
		const id = item.NTIID || item.ID;
		const active = this[RAW_ACTIVE];

		this.active = active.filter(x => x.NTIID !== id);
	}
}

export default class AssociationInterface extends EventEmitter {
	static createItem (item, onAddTo, onRemoveFrom, cfg) {
		return new Item(item, onAddTo, onRemoveFrom, cfg);
	}

	static createGroup (label, items) {
		return new Group(label, items);
	}

	constructor (destinations, active, backing) {
		super();

		if (active) {
			this.active = active;
		}

		if (destinations) {
			this.destinations = destinations;
		}

		this.backingItem = backing;
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


	/**
	 * Set the possible destinations to create associations with
	 * @param  {Object} destinations the list of destinations
	 * @returns {void}
	 */
	set destinations (destinations) {
		const groups = groupDestinations(destinations);

		this[DESTINATIONS] = groups;

		this.onChanged();
	}


	/**
	 * Set the active associations in the possible destinations
	 * @param  {Object} active list of active associations either object or ID
	 * @returns {void}
	 */
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


	/**
	 * Add an active association
	 * @param {Object} active possible destination to add or ID
	 * @returns {void}
	 */
	addActive (active) {
		if (this[ACTIVE]) {
			this[ACTIVE].add(active);
		} else {
			this.active = [active];
		}
	}


	/**
	 * Remove an active association
	 * @param  {Object|string} active active destination to remove
	 * @returns {void}
	 */
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


	isSharedWith (item) {
		return !!this.getAssociationFor(item);
	}


	getAssociationFor (item) {
		return this[ACTIVE] && this[ACTIVE].getAssociationFor(item);
	}


	/**
	 * Create a new interface with the given destinations, but with the
	 * same active.
	 *
	 * @param {Object} destinations the destinations to have in the clone
	 * @returns {Object} a new associations interface
	 */
	[CLONE] (destinations) {
		return new AssociationInterface(destinations, this[ACTIVE], this.backingItem);
	}

	/**
	 * Filter the possible destinations by a given fn, return a clone with
	 * the filtered destinations.
	 * @param  {Function} fn the filter function
	 * @returns {Object}      new associations interface
	 */
	filter (fn) {
		const filteredGroups = filterGroups(this.destinations || [], fn);

		return this[CLONE](filteredGroups);
	}


	/**
	 * Flatten the destinations to a flat array, return a clone with the
	 * flattened destinations.
	 *
	 * @returns {Object} new associations interface
	 */
	flatten () {
		const flattenedGroups = flattenGroups(this.destinations || []);

		return this[CLONE](flattenedGroups);
	}
}
