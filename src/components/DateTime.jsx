import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'isempty';
import moment from 'moment-timezone';
import invariant from 'invariant';
import jstz from 'jstimezonedetect';

const returnFalse = () => false;

//days threshold to 25 (our dd -- day plural-- takes care of weeks) any more than 25 days falls to months.
moment.relativeTimeThreshold('d', 25);
const localeData = moment.localeData('en');
const RELATIVE_TIME_KEY = '_relativeTime';
const relativeTimeData = localeData[RELATIVE_TIME_KEY];
invariant(relativeTimeData, 'momentjs changed where they store relativeTime in localeData');

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
