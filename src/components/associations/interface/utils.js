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

export function mapActive (active) {
	return active.reduce((acc, item) => {
		if (item.NTIID != null) {
			acc[item.NTIID] = true;
		} else if (typeof item === 'string') {
			acc[item] = true;
		}

		return acc;
	}, {});
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
