import constrain from './constrain-saturation-brightness';

const delta = 0.01;

const handlers = {
	'ArrowDown': ({saturation, brightness}) => ({saturation, brightness: brightness - delta}),
	'ArrowUp': ({saturation, brightness}) => ({saturation, brightness: brightness + delta}),
	'ArrowLeft': ({saturation, brightness}) => ({saturation: saturation - delta, brightness}),
	'ArrowRight': ({saturation, brightness}) => ({saturation: saturation + delta, brightness}),
};

export default function updateSaturationBrightnessForKeyEvent (e, prev) {
	const handler = handlers[e.key];
	const updated = handler ? handler(prev) : prev;

	return constrain(updated);
}