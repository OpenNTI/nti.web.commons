import React, {PropTypes} from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';
import isEmpty from 'isempty';
import moment from 'moment-timezone';

import jstz from 'jstimezonedetect';

//days threshold to 25 (our dd -- day plural-- takes care of weeks) any more than 25 days falls to months.
moment.relativeTimeThreshold('d', 25);
//Add custom plural day callback to handle weeks. moment doesn't merge sub-objects...so we have
//to include the entire relativeTime object with our custom dd
moment.updateLocale('en', {
	relativeTime : {
		future: 'in %s',
		past: '%s ago',
		s: 'seconds',
		m: 'a minute',
		mm: '%d minutes',
		h: 'an hour',
		hh: '%d hours',
		d: 'a day',
		dd (number) {
			let weeks = Math.round(number / 7);
			return (number < 7)
				// if less than a week, use days
				? `${number} days`
				// pluralize weeks
				: `${weeks} week${(weeks === 1 ? '' : 's')}`;
		},
		M:  'a month',
		MM: '%d months',
		y:  'a year',
		yy: '%d years'
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
				todayText
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
			m.isSame = emptyFunction;//will return falsy
		}

		const suffixExplicitlySuppressed = suffix === false;
		const hasCustomSuffix = !isEmpty(suffix);
		const omitSuffix = suffixExplicitlySuppressed || hasCustomSuffix;

		let text = relative || relativeTo ?
					m.fromNow(omitSuffix) :
					m.format(format);

		if ((showToday || !isEmpty(todayText)) && m.isSame(new Date(), 'day')) {
			text = todayText || 'Today';
		}

		text = (prefix || '') + text + (suffix || '');

		const props = Object.assign({}, this.props, {
			dateTime: moment(date).format()
		});

		return (<time {...props}>{text}</time>);
	}
}
