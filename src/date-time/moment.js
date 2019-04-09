import moment from 'moment-timezone';
import invariant from 'invariant';

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

export default moment;
