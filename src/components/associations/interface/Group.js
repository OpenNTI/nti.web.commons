const ITEMS = Symbol('Items');
const LABEL = Symbol('Label');

export default class AssociationGroup {
	constructor (label, items, collapseIfEmpty = true) {
		this[LABEL] = label || '';
		this[ITEMS] = items || [];
		this.collapseIfEmpty = collapseIfEmpty;
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
