import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'isempty';
import moment from 'moment-timezone';
import invariant from 'invariant';
import jstz from 'jstimezonedetect';
import {scoped} from 'nti-lib-locale';

const returnFalse = () => false;

//days threshold to 25 (our dd -- day plural-- takes care of weeks) any more than 25 days falls to months.
moment.relativeTimeThreshold('d', 25);
const localeData = moment.localeData('en');
const RELATIVE_TIME_KEY = '_relativeTime';
const relativeTimeData = localeData[RELATIVE_TIME_KEY];
invariant(relativeTimeData, 'momentjs changed where they store relativeTime in localeData');

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
const t = scoped('nti-web-common.components.DateTime', DEFAULT_TEXT);

//Add custom plural day callback to handle weeks. moment doesn't merge sub-objects...so we have
//to include the entire relativeTime object with our custom dd
moment.updateLocale('en', {
	relativeTime: {
		...relativeTimeData,

		dd (number) {
			let weeks = Math.round(number / 7);
			return (number < 7)
				// if less than a week, use days
				? `${number} days`
				// pluralize weeks
				: `${weeks} week${(weeks === 1 ? '' : 's')}`;
		}
	}
});


export default class DateTime extends React.Component {

	static format (date, pattern = 'LL') {
		const tz = jstz.determine().name();
		return date && moment(new Date(date)).tz(tz).format(pattern);
	}


	static fromNow (date) {
		const tz = jstz.determine().name();
		return date && moment(new Date(date)).tz(tz).fromNow();
	}


	/**
	 * Format seconds into a human readable duration
	 *
	 * Taken from: https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss/40350003#40350003
	 *
	 * @param  {Number} duration number of seconds to format
	 * @return {String}          human readable format
	 */
	static formatDuration (duration) {
		const h = Math.floor(duration / 3600);
		const m = Math.floor((duration % 3600) / 60);
		const s = duration % 60;

		return [
			h,
			m > 9 ? m : (h ? '0' + m : m || '0'),
			s > 9 ? s : '0' + s,
		].filter(a => a).join(':');
	}


	static getNaturalDuration (duration, accuracy, singular) {
		const d = new moment.duration(duration);
		const getUnit = (unit, data) => singular ? t(`timeUnits.singular.${unit}`, data) : t(`timeUnits.${unit}`, data);

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

		return out.join(', ');
	}


	static propTypes = {
		date: PropTypes.any,//Date
		relativeTo: PropTypes.any,//Date
		format: PropTypes.string,
		relative: PropTypes.bool,
		prefix: PropTypes.string,
		suffix: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.bool
		]),
		showToday: PropTypes.bool,
		todayText: PropTypes.string
	}


	static defaultProps = {
		date: new Date(),
		relativeTo: undefined,
		format: 'LL',
		relative: false,
		prefix: undefined,
		suffix: undefined,
		showToday: false,
		todayText: undefined
	}


	constructor (props) {
		super(props);
		this.state = {tz: jstz.determine().name()};
	}


	render () {
		const {
			props: {
				date,
				format,
				prefix,
				suffix,
				showToday,
				relativeTo,
				relative,
				todayText,
				...otherProps
			},
			state: {
				tz
			}
		} = this;

		if (date == null) {
			return null;
		}

		let m = moment(date).tz(tz);

		if (relativeTo) {
			m = moment.duration(m.diff(relativeTo));
			//#humanize(Boolean) : true to include the suffix,
			//#fromNow(Boolean) : true to omit suffix.
			// :/ instant confusion.
			//
			// We are mapping the duration object to behave just like a moment object.
			m.fromNow = omitSuffix => m.humanize(!omitSuffix);
			m.isSame = returnFalse;
		}

		const suffixExplicitlySuppressed = suffix === false;
		const hasCustomSuffix = !isEmpty(suffix);
		const omitSuffix = suffixExplicitlySuppressed || hasCustomSuffix;

		let text = relative || relativeTo ?
			m.fromNow(omitSuffix) :
			m.format(format);

		if ((showToday || !isEmpty(todayText)) && m.isSame(new Date(), 'day')) {
			text = (todayText || 'Today').replace('{time}', text);
		}

		text = (prefix || '') + text + (suffix || '');

		const props = Object.assign({}, otherProps, {
			dateTime: moment(date).format()
		});

		return (<time {...props}>{text}</time>);
	}
}
