import Group from './Group';

export function groupDestinations (destinations) {
	let currentWrapper = null;

	return destinations.reduce((acc, destination) => {
		if (destination instanceof Group) {
			currentWrapper = null;
			acc.push(destination);
		} else {
			if (!currentWrapper) {
				currentWrapper = new Group();
				acc.push(currentWrapper);
			}

			currentWrapper.push(destination);
		}

		return acc;
	}, []);
}

export function flattenGroups (groups) {
	return groups.reduce((acc, group) => {
		if (group instanceof Group) {
			acc = [...acc, ...flattenGroups(group.items)];
		} else {
			acc.push(group);
		}

		return acc;
	}, []);
}


export function filterGroups (groups, fn) {
	return groups.reduce((acc, group) => {
		const filteredGroup = group.filter(fn);

		if (!filteredGroup.isEmpty) {
			acc.push(filteredGroup);
		}

		return acc;
	}, []);
}


export function groupItemsByParent (items) {
	function getLabel (item) {
		return item.label || item.title;
	}

	const parents = items.reduce((acc, item) => {
		const parent = item.item.parent();
		const id = parent.getID();

		if (acc.map[id]) {
			acc.map[id].push(item);
		} else {
			acc.order.push(id);
			acc.map[id] = new Group (getLabel(parent), [item]);
		}

		return acc;
	}, {map: {}, order: []});

	return parents.order.map(x => parents.map[x]);
}
