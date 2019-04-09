import {scoped} from '@nti/lib-locale';

const DEFAULT_TEXT = {
	timeUnits: {
		singular: {
			years: '%(count)s Year',
			months: '%(count)s Month',
			weeks: '%(count)s Week',
			days: '%(count)s Day',
			hours: '%(count)s Hour',
			minutes: '%(count)s Minute',
			seconds: '%(count)s Second',
			milliseconds: '%(count)s Millisecond'
		},
		short: {
			years: '%(count)sy',
			months: '%(count)sm',
			weeks: '%(count)sw',
			days: '%(count)sd',
			hours: '%(count)sh',
			minutes: '%(count)sm',
			seconds: '%(count)ss',
			milliseconds: '%(count)smm'
		},
		years: {
			one: '%(count)s Year',
			other: '%(count)s Years'
		},
		months: {
			one: '%(count)s Month',
			other: '%(count)s Months'
		},
		weeks: {
			one: '%(count)s Week',
			other: '%(count)s Weeks'
		},
		days: {
			one: '%(count)s Day',
			other: '%(count)s Days'
		},
		hours: {
			one: '%(count)s Hour',
			other: '%(count)s Hours'
		},
		minutes: {
			one: '%(count)s Minute',
			other: '%(count)s Minutes'
		},
		seconds: {
			one: '%(count)s Second',
			other: '%(count)s Seconds'
		},
		milliseconds: {
			one: '%(count)s Millisecond',
			other: '%(count)s Milliseconds'
		},
	}
};

export default scoped('web-common.components.DateTime', DEFAULT_TEXT);
