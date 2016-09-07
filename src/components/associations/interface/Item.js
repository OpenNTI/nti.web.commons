import EventEmitter from 'events';

const ITEM = Symbol('Association Item');
const ADD_TO = Symbol('Add to Association Item');
const REMOVE_FROM = Symbol('Remove Association Item');
const CFG = Symbol('Association Item Config');
const GROUP = Symbol('Association Group');

export default class AssociationItem extends EventEmitter {
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

	get item () {
		return this[ITEM];
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


	onAddTo () {
		if (this[ADD_TO]) {
			this[ADD_TO](this.item);
		}
	}


	onRemoveFrom () {
		if (this[REMOVE_FROM]) {
			this[REMOVE_FROM](this.item);
		}
	}
}
