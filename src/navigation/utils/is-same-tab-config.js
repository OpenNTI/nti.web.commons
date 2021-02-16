export default function isSameTabConfig(configA = [], configB = []) {
	if (!configA && !configB) {
		return true;
	}
	if ((configA && !configB) || (!configA && configB)) {
		return false;
	}
	if (configA.length !== configB.length) {
		return false;
	}

	for (let i = 0; i < configA.length; i++) {
		if (configA[i].id !== configB[i].id) {
			return false;
		}
	}

	return true;
}
