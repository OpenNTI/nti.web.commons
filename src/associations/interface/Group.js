const ITEMS = Symbol('Items');
const LABEL = Symbol('Label');
const SETUP_ITEM = Symbol('Set Up Item');

let COUNTER = 0;

export default class AssociationGroup {
	constructor (label = '', items = [], collapseIfEmpty = true) {
		for (let item of items) {
			this[SETUP_ITEM](item);
		}

		this[LABEL] = label;
		this[ITEMS] = items;
		this.collapseIfEmpty = collapseIfEmpty;

		COUNTER += 1;

		this.ID = COUNTER;
	}

	[SETUP_ITEM] (item) {
		if (item.isAssociationItem) {
			item.group = this;
		}
	}

	isAssociationsGroup = true

	get label () {
		return this[LABEL];
	}


	set label (label) {
		this[LABEL] = label;
		return label;
	}


	get items () {
		return this[ITEMS];
	}


	get isEmpty () {
		return this.items.length === 0;
	}


	push (item) {
		this[SETUP_ITEM](item);

		this[ITEMS].push(item);
	}


	filter (fn) {
		const {items} = this;

		let filteredItems = items.reduce((acc, item) => {
			if (item instanceof AssociationGroup) {
				const filteredGroup = item.filter(fn);

				if (!filteredGroup.isEmpty) {
					acc.push(item.filter(fn));
				}
			} else if (fn(item)) {
				acc.push(item);
			}

			return acc;
		}, []);

		return new AssociationGroup(this.label, filteredItems);
	}
}
