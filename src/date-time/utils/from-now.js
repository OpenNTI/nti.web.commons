import {formatDistanceToNowStrict} from 'date-fns';

// This is how moment computed `fromNow()`:
// Range						Key		Sample Output
// 0 to 44 seconds				s		a few seconds ago
// unset						ss		44 seconds ago
// 45 to 89 seconds				m		a minute ago
// 90 seconds to 44 minutes		mm		2 minutes ago ... 44 minutes ago
// 45 to 89 minutes				h		an hour ago
// 90 minutes to 21 hours		hh		2 hours ago ... 21 hours ago
// 22 to 35 hours				d		a day ago
// 36 hours to 25 days			dd		2 days ago ... 25 days ago
// 26 to 45 days				M		a month ago
// 45 to 319 days				MM		2 months ago ... 10 months ago
// 320 to 547 days (1.5 years)	y		a year ago
// 548 days+					yy		2 years ago ... 20 years ago


function dd (number) {
	number = parseInt(number, 10);
	let weeks = Math.round(number / 7);
	return (number < 7)
	// if less than a week, fallback
		? null
	// pluralize weeks
		: `${weeks} week${(weeks === 1 ? '' : 's')}`;
}


export function fromNow (date, omitSuffix) {
	// date-fns doesn't roll over to months until just under 30 days
	const str = formatDistanceToNowStrict(date, { addSuffix: !omitSuffix});
	return str
		.replace(/(\d+) days/, (match, number) => dd(number) || match)
		.replace(/(^1)(.*)/, (_, __, unit) =>
			(/hour/.test(unit) ? 'an' : 'a') + unit);
}
