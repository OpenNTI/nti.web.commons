import { scoped } from '@nti/lib-locale';

const t = scoped('common.date-time', {
	at: '%(prefix)s at %(time)s',
});

export const DATE = 'M/dd/yyyy';
export const DATE_PADDED = 'MM/dd/yyyy';
export const DATE_YYYY_MM_DD = 'yyyy-MM-dd';
export const DAY_OF_THE_MONTH = 'd';
export const DAY_OF_THE_MONTH_PADDED = 'dd';
export const HOUR_APM = 'h a';
export const MONTH_ABBR = 'MMM';
export const MONTH_ABBR_DAY = 'MMM d';
export const MONTH_ABBR_DAY_YEAR = 'MMM d, yyyy'; //ll
export const MONTH_ABBR_DAY_YEAR_TIME = 'MMM d, yyyy h:mm a'; //lll
export const MONTH_DAY = 'M/dd';
export const MONTH_DAY_PADDED = 'MM/dd';
export const MONTH_DAY_TIME = 'MMMM d h:mm a';
export const MONTH_NAME_DAY = 'MMMM d';
export const MONTH_NAME_DAY_YEAR = 'MMMM d, yyyy';
export const MONTH_NAME_DAY_YEAR_TIME = 'MMMM d, yyyy h:mm a'; //LLL
export const MONTH_NAME_ORDINAL_DAY_TIME_WITH_ZONE = 'MMMM do, h:mm a z';
export const MONTH_NAME_ORDINAL_DAY_YEAR = 'MMMM do, yyyy';
export const MONTH_NAME_ORDINAL_DAY_YEAR_TIME = 'MMMM do yyyy, h:mm a';
export const MONTH_NAME_YEAR = 'MMMM yyyy';
export const TIME = 'h:mm a';
export const TIME_24 = 'H:mm a';
export const TIME_DATE_STAMP = 'h:mm a M/d/yyyy';
export const TIME_PADDED = 'hh:mm a';
export const TIME_PADDED_WITH_ZONE = 'hh:mm a z';
export const TIME_SECONDS = 'h:mm:ss a';
export const TIME_START_RANGE = 'h:mm';
export const TIME_WITH_ZONE = 'h:mm a z';
export const WEEKDAY = 'eeee';
export const WEEKDAY_ABBR_MONTH_ABBR_DAY_YEAR_TIME = 'eee, MMMM d, yyyy h:mm a';
export const WEEKDAY_ABBR_MONTH_ABBR_ORDINAL_DAY = 'eee, MMM do';
export const WEEKDAY_ABBR_MONTH_NAME_DAY = 'eee MMMM d';
export const WEEKDAY_ABBR_MONTH_NAME_DAY_YEAR = 'eee MMMM d, yyyy';
export const WEEKDAY_ABBR_MONTH_NAME_ORDINAL_DAY = 'eee, MMMM do';
export const WEEKDAY_MONTH_NAME_DAY = 'eeee, MMMM d';
export const WEEKDAY_MONTH_NAME_DAY_TIME = 'eeee, MMMM d, h:mm a';
export const WEEKDAY_MONTH_NAME_DAY_TIME_WITH_ZONE = 'eeee, MMMM d, h:mm a z';
export const WEEKDAY_MONTH_NAME_DAY_YEAR = 'eeee, MMMM d, yyyy';
export const WEEKDAY_MONTH_NAME_DAY_YEAR_TIME = 'eeee, MMMM d, yyyy h:mm a';
export const WEEKDAY_MONTH_NAME_DAY_YEAR_TIME_WITH_ZONE =
	'eeee, MMMM d, yyyy h:mm a z';
export const WEEKDAY_MONTH_NAME_ORDINAL_DAY = 'eeee, MMMM do';
export const WEEKDAY_MONTH_NAME_ORDINAL_DAY_YEAR = 'eeee, MMMM do, yyyy';

export const DEFAULT = MONTH_NAME_DAY_YEAR;

export const MONTH_ABBR_DAY_AT_TIME = formatter =>
	t('at', {
		prefix: formatter(MONTH_ABBR_DAY),
		time: formatter(TIME),
	});

export const MONTH_ABBR_DAY_YEAR_AT_TIME = formatter =>
	t('at', {
		prefix: formatter(MONTH_ABBR_DAY_YEAR),
		time: formatter(TIME),
	});

export const MONTH_NAME_DAY_AT_TIME = formatter =>
	t('at', {
		prefix: formatter(MONTH_NAME_DAY),
		time: formatter(TIME),
	});
export const MONTH_NAME_DAY_YEAR_AT_TIME = formatter =>
	t('at', {
		prefix: formatter(MONTH_NAME_DAY_YEAR),
		time: formatter(TIME),
	});

export const WEEKDAY_MONTH_NAME_DAY_AT_TIME = formatter =>
	t('at', {
		prefix: formatter(WEEKDAY_MONTH_NAME_DAY),
		time: formatter(TIME),
	});

export const WEEKDAY_MONTH_NAME_DAY_AT_TIME_WITH_ZONE = formatter =>
	t('at', {
		prefix: formatter(WEEKDAY_MONTH_NAME_DAY),
		time: formatter(TIME_WITH_ZONE),
	});

export const WEEKDAY_AT_TIME_PADDED_WITH_ZONE = formatter =>
	t('at', {
		prefix: formatter(WEEKDAY),
		time: formatter(TIME_PADDED_WITH_ZONE),
	});
