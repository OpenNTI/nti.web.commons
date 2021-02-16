import constrain from './constrain-saturation-brightness';

export default function computeSaturationBrightnessForPoint(x, y, container) {
	const rect = container.getBoundingClientRect();

	const left = Math.max(0, Math.min(x - rect.left, rect.width));
	const top = Math.max(0, Math.min(y - rect.top, rect.height));

	return constrain({
		saturation: left / rect.width,
		brightness: 1 - top / rect.height,
	});
}
