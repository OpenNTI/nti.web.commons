import EventEmitter from 'events';

const ITEM = Symbol('Association Item');
const ADD_TO = Symbol('Add to Association Item');
const REMOVE_FROM = Symbol('Remove Association Item');
const CFG = Symbol('Association Item Config');
const GROUP = Symbol('Association Group');
const SAVING = Symbol('Association Saving');
const ERROR = Symbol('Association Error');

const EDIT = Symbol('Edit Association');

export default class AssociationItem extends EventEmitter {
	/**
	 * A wrapper to add some utils for associations
	 * @param  {Object} item         the item for association
	 * @param  {Function} onAddTo     callback for when the association is added, must return a Promise
	 * @param  {Function} onRemoveFrom callback for when the association is removed, must return a Promise
	 * @param  {Object} cfg          configuration options for the association
	 * @return {Object}             	an instance of AssociationItem
	 */
	constructor (item, onAddTo, onRemoveFrom, cfg) {
		super();

		this[ITEM] = item;
		this[ADD_TO] = onAddTo;
		this[REMOVE_FROM] = onRemoveFrom;
		this[CFG] = cfg;
	}

	isAssociationItem = true


	get ID () {
		//TODO: make this better....
		return this[ITEM].LessonOverviewNTIID || this[ITEM].NTIID || this[ITEM].ID;
	}


	get type () {
		return this[ITEM].MimeType || this[ITEM].type;
	}


	get label () {
		return this[ITEM].label || this[ITEM].title;
	}


	get item () {
		return this[ITEM];
	}


	get isSaving () {
		return this[SAVING];
	}


	get error () {
		return this[ERROR];
	}


	get group () {
		return this[GROUP];
	}


	set group (group) {
		this[GROUP] = group;

		this.emit('change');
	}


	get config () {
		return this[CFG];
	}


	set config (cfg) {
		this[CFG] = cfg;

		this.emit('change');
	}

	[EDIT] (method, container, association) {
		this[ERROR] = null;
		this[SAVING] = true;
		this.emit('change');

		Promise.resolve(this[method](container || this.item, association))
			.then(() => {
				this[SAVING] = false;

				this.emit('change');
			})
			.catch((reason) => {
				this[SAVING] = false;
				this[ERROR] = reason;

				this.emit('change');
			});
	}


	canAddTo () {
		return !!this[ADD_TO];
	}


	/**
	 * Add an association
	 *
	 * @param  {Object} container the destination to add an association, if not passed use
	 *                            this.item
	 * @param {Object} association the parent object of the container if needed
	 * @return {Promise}          Fulfills or rejects with the success of adding an association
	 */
	onAddTo (container, association) {
		if (this[ADD_TO]) {
			this[EDIT](ADD_TO, container, association);
		} else {
			throw new Error('No method provided to add association');
		}
	}


	canRemoveFrom () {
		return !!this[REMOVE_FROM];
	}


	/**
	 * Add an association
	 *
	 * @param  {Object} container the destination to add an association, if not passed use
	 *                            this.item
	 * @param {Object} association the parent object of the container if needed
	 * @return {Promise}          Fulfills or rejects with the success of adding an association
	 */
	onRemoveFrom (container, association) {
		if (this[REMOVE_FROM]) {
			this[EDIT](REMOVE_FROM, container, association);
		} else {
			throw new Error('No method provided to remove association');
		}
	}
}
