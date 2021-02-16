const Targets = new Map();

export function registerTarget(error, target) {
	Targets.set(error, target);

	return () => Targets.delete(error);
}

export function getTarget(error) {
	return Targets.get(error);
}
