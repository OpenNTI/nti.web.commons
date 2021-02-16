import getEffectiveScreenSize from './get-effective-screen-size';

export default function isScreenHeightInRange(min = 0, max = Infinity) {
	const size = getEffectiveScreenSize();

	return size.height >= min && size.height <= max;
}
