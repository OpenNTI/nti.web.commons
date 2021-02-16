export const isBetween = (min, max) => {
	return value => {
		return value != null && value >= min && value <= max;
	};
};
