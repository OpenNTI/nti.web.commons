const WHEEL_SCALE_FACOR = 0.1;

export default function getScaleForMouseWheel (e, {aspectRatio}) {
	const rawDelta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
	const dir = rawDelta < 0 ? 1 : -1;

	return 1 + (WHEEL_SCALE_FACOR * dir);
}
