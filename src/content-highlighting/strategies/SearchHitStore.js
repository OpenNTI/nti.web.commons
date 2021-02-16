const HitsForContainers = new Map();

export function setHitForContainer(container, hit, fragment, phraseSearch) {
	return HitsForContainers.set(container, { hit, fragment, phraseSearch });
}

export function getHitForContainer(container) {
	return HitsForContainers.get(container);
}

export function clearHitForContainer(container) {
	return HitsForContainers.delete(container);
}
