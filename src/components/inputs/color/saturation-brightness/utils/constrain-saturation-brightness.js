const MIN = 0.01;
const MAX = 1;
const constrain = v => Math.min(MAX, Math.max(MIN, v));
const trim = v => (Math.round(v * 1000) / 1000);

export default function contrainSaturationBrightness (value) {
	if (!value) { return null;}

	return {
		saturation: trim(constrain(value.saturation)),
		brightness: trim(constrain(value.brightness))
	};
}