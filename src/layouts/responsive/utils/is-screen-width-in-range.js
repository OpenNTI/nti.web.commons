import getEffectiveScreenSize from './get-effective-screen-size';

export default function isScreenWidthInRange (min = 0, max = Infinity) {
	const size = getEffectiveScreenSize();

	return size.width >= min && size.width <= max;
}
