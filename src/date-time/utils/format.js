import moment from '../moment';

import t from './strings';

export function format (date, pattern = 'LL') {
	const tz = moment.tz.guess();
	return date && moment(new Date(date)).tz(tz).format(pattern);
}

export function fromNow (date) {
	const tz = moment.tz.guess();
	return date && moment(new Date(date)).tz(tz).fromNow();
}

export function isToday (date) {
	return moment(date).isSame(new Date(), 'day');
}

/**
 * Format seconds into a human readable duration
 *
 * Taken from: https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss/40350003#40350003
 *
 * @param  {Number} duration number of seconds to format
 * @return {String}          human readable format
 */
export function formatDuration (duration) {
	duration = Math.round(duration);
	const h = Math.floor(duration / 3600);
	const m = Math.floor((duration % 3600) / 60);
	const s = duration % 60;

	return [
		h,
		m > 9 ? m : (h ? '0' + m : m || '0'),
		s > 9 ? s : '0' + s,
	].filter(a => a).join(':');
}

export function getShortNaturalDuration (duration, accuracy) {
	return this.getNaturalDuration(duration, accuracy, null, true);
}

export function getNaturalDuration (duration, accuracy, singular, short) {
	let baseLocaleKey = 'timeUnits.';

	if (short) {
		baseLocaleKey += 'short.';
	} else if (singular) {
		baseLocaleKey += 'singular.';
	}

	const d = new moment.duration(duration);
	const getUnit = (unit, data) => t(`${baseLocaleKey}${unit}`, data);

	let out = [];

	function maybeAdd (unit) {
		let u = d.get(unit);
		if (u > 0 && (!accuracy || out.length < accuracy)) {
			out.push(getUnit(unit, {count: u}));
		}
	}

	maybeAdd('years');
	maybeAdd('months');
	maybeAdd('weeks');
	maybeAdd('days');
	maybeAdd('hours');
	maybeAdd('minutes');
	maybeAdd('seconds');

	if (out.length === 0) {
		out.push(getUnit('seconds', {count: 0}));
	}

	if (short) {
		return out.join(' ');
	}

	return out.join(', ');
}
