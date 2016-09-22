import EventEmitter from 'events';

const ITEM = Symbol('Association Item');
const ADD_TO = Symbol('Add to Association Item');
const REMOVE_FROM = Symbol('Remove Association Item');
const CFG = Symbol('Association Item Config');
const GROUP = Symbol('Association Group');
const SAVING = Symbol('Association Saving');
const ERROR = Symbol('Association Error');

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

		if (item.addListener) {
			item.addListener('change', () => {
				this.emit('change');
			});
		}
	}

	isAssociationItem = true


	get ID () {
		return this[ITEM].NTIID || this[ITEM].ID;
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

		return group;
	}


	get config () {
		return this[CFG];
	}


	set config (cfg) {
		this[CFG] = cfg;

		this.emit('change');
	}


	canAddTo () {
		return !!this[ADD_TO];
	}


	onAddTo (container) {
		if (this[ADD_TO]) {
			this[ERROR] = null;
			this[SAVING] = true;
			this.emit('change');

			this[ADD_TO](container || this.item, container && this.item)
				.then(() => {
					this[SAVING] = false;
					this.emit('change');
				})
				.catch((reason) => {
					this[SAVING] = false;
					this[ERROR] = reason;

					this.emit('change');
				});
		} else {
			throw new Error('No method provided to add association');
		}
	}


	canRemoveFrom () {
		return !!this[REMOVE_FROM];
	}


	onRemoveFrom () {
		if (this[REMOVE_FROM]) {
			this[REMOVE_FROM](this.item);
		}
	}
}
