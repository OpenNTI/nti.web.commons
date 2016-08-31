const ITEM = Symbol('Association Item');
const GROUP_LABEL = Symbol('Association Group Label');

export default class AssociationItem {
	constructor (item, groupLabel) {
		this[ITEM] = item;
		this[GROUP_LABEL] = groupLabel;
	}

	get item () {
		return this[ITEM];
	}


	get groupLabel () {
		return this[GROUP_LABEL];
	}

	set groupLabel (label) {
		this[GROUP_LABEL] = label;

		return label;
	}
}
