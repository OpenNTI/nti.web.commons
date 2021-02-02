import { intervalToDuration, isSameDay, parseJSON } from 'date-fns';
import { format as formatter } from 'date-fns-tz';

import { DEFAULT } from './formats';
import { fromNow, fromWhen } from './from-when';
import t from './strings';

export {fromNow, fromWhen};

const timeZone = global.Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone ?? undefined;


export function format (date, pattern = DEFAULT) {
	if (!date) {
		return;
	}

	if (!(date instanceof Date)) {
		date = parseJSON(date);
	}

	const f = x => formatter(date, x, { timeZone });
	return (typeof pattern === 'function')
		? pattern(f)
		: f(pattern);
}

export function isToday (date) {
	return isSameDay(date, new Date());
}

/**
 * Format seconds into a human readable duration
 *
 * Taken from: https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss/40350003#40350003
 *
 * @param  {number} duration number of seconds to format
 * @returns {string}          human readable format
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

/**
 *
 * @param {number} duration - The duration in milliseconds?
 * @param {number} accuracy - accuracy cutoff
 * @returns {string} - a human friendly description of the duration
 */
export function getShortNaturalDuration (duration, accuracy) {
	return getNaturalDuration(duration, accuracy, null, true);
}

/**
 *
 * @param {number} duration - The duration in milliseconds?
 * @param {number} accuracy - accuracy cutoff
 * @param {boolean} singular - use singular form
 * @param {boolean} short - use short form
 * @returns {string} - a human friendly description of the duration
 */
export function getNaturalDuration (duration, accuracy, singular, short) {
	let baseLocaleKey = 'timeUnits.';

	if (short) {
		baseLocaleKey += 'short.';
	} else if (singular) {
		baseLocaleKey += 'singular.';
	}

	const reference = new Date();
	const d = intervalToDuration({
		start: reference,
		end: new Date(reference.getTime() + duration)
	});

	const getUnit = (unit, data) => t(`${baseLocaleKey}${unit}`, data);

	let out = [];

	function maybeAdd (unit) {
		let u = d[unit];
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
