import { formatDistanceStrict } from 'date-fns';
const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;
const WEEK = 604800;
const MONTH = 2592000; // ~26 days
const YEAR = 31536000;

const toSeconds = seconds => seconds;
const toMinutes = seconds => Math.round(seconds / MINUTE);
const toHours = seconds => Math.round(seconds / HOUR);
const toDays = seconds => Math.round(seconds / DAY);
const toWeeks = seconds => Math.round(seconds / WEEK);
const toMonths = seconds => Math.round(seconds / MONTH);
const toYears = seconds => Math.round(seconds / YEAR);

const locale = {
	s: 'a few seconds',
	m: 'a minute',
	mm: '{{count}} minutes',
	h: 'an hour',
	hh: '{{count}} hours',
	d: 'a day',
	dd: '{{count}} days',
	w: 'a week',
	ww: '{{count}} weeks',
	M: 'a month',
	MM: '{{count}} months',
	y: 'a year',
	yy: '{{count}} years',
};

const ranges = {
	s: [0, 44, toSeconds],
	m: [45, 89, toMinutes],
	mm: [90, 45 * MINUTE - 1, toMinutes],
	h: [45 * MINUTE, 90 * MINUTE - 1, toHours],
	hh: [90 * MINUTE, 22 * HOUR - 1, toHours],
	d: [22 * HOUR, 36 * HOUR - 1, toDays],
	dd: [36 * HOUR, 7 * DAY - 1, toDays],
	w: [6 * DAY, 10 * DAY - 1, toWeeks],
	ww: [10 * DAY, 4 * WEEK - 1, toWeeks],
	M: [4 * WEEK, 45 * DAY - 1, toMonths],
	MM: [45 * DAY, 320 * DAY - 1, toMonths],
	y: [320 * DAY, 548 * DAY - 1, toYears],
	yy: [-Infinity, Infinity, toYears],
};

function find(seconds) {
	for (const [key, [start, end, convert]] of Object.entries(ranges)) {
		if (seconds >= start && seconds <= end) {
			return [key, convert(seconds)];
		}
	}
}

const normal = {
	xSeconds: x => x,
	xMinutes: x => x * MINUTE,
	xHours: x => x * HOUR,
	xDays: x => x * DAY,
	xMonths: x => x * MONTH,
	xYears: x => x * YEAR,
};

function formatDistance(token, count, options) {
	options = options || {};

	const norm = normal[token](count);
	const [key, count2] = find(norm);

	let result = locale[key]?.replace('{{count}}', count2);
	if (!result) {
		// eslint-disable-next-line no-console
		console.warn('Missing locale string for key: %s', key);
	}

	if (options.addSuffix) {
		if (options.comparison > 0) {
			return 'in ' + result;
		} else {
			return result + ' ago';
		}
	}

	return result;
}

const DEFAULT_OPTIONS = { addSuffix: true, locale: { formatDistance } };

export function fromWhen(date, baseDate, options) {
	return formatDistanceStrict(date, baseDate, {
		...DEFAULT_OPTIONS,
		...options,
	});
}

export function fromNow(date, options) {
	return fromWhen(date, Date.now(), { ...DEFAULT_OPTIONS, ...options });
}
