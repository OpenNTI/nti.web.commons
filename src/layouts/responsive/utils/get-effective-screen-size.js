import {getScreenWidth, getScreenHeight} from '@nti/lib-dom';

export default function getEffectiveScreenSize () {
	const orientation = Math.abs(global.orientation);
	const rotated = orientation === 90;

	return {
		width: rotated ? getScreenHeight() : getScreenWidth(),
		height: rotated ? getScreenWidth() : getScreenHeight()
	};
}
