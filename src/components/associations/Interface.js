import EventEmitter from 'events';

const ACTIVE = Symbol('Active Associations');
const POTENTIAL = Symbol('Potential Associations');

const ADD_TO = Symbol('Add Association');
const REMOVE_FROM = Symbol('Remove Association');

export default class AssociationsInterface extends EventEmitter {
	/**
	 * Create an interface to deal with creating and removing associations
	 *
	 * @param  {Array} active       the list of active associations, should be a subset of the potential associations
	 * @param  {Array} potential    the list of all potential associations to show
	 * @param  {Function} onAddTo   a function that creates an association, and returns a promise
	 * @param  {Function} onRemoveFrom a function that removes an association, and returns a promise
	 * @return {Object}              an AssociationsInterface
	 */
	constructor (active, potential, onAddTo, onRemoveFrom) {
		super();

		const defaultHandler = () => Promise.reject();

		this[ACTIVE] = active;
		this[POTENTIAL] = potential;

		this[ADD_TO] = onAddTo || defaultHandler;
		this[REMOVE_FROM] = onRemoveFrom || defaultHandler;
	}


	get isLoading () {
		const {active, potential} = this;

		return !active && !potential;
	}


	get potential () {
		return this[POTENTIAL];
	}


	get active () {
		return this[ACTIVE];
	}


	set potential (potential) {
		this[POTENTIAL] = potential;

		this.emit('changed');
	}


	set active (active) {
		this[ACTIVE] = active;

		this.emit('changed');
	}


	createAssociation (assocition) {

	}


	removeAssociation (assocition) {

	}
}


export function createInterfaceForRecord (record, potential, onAddTo, onRemoveFrom) {

}


export function createInterfaceForActive (active, potential, onAddTo, onRemoveFrom) {

}
