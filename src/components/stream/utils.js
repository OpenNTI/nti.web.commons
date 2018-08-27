export const DATE_FILTER_VALUES = {
	ANYTIME: null,
	PAST_WEEK: 'pastweek',
	PAST_MONTH: 'pastmonth',
	PAST_THREE_MONTHS: 'pastthreemonths',
	PAST_SIX_MONTHS: 'pastsixmonths',
	PAST_YEAR: 'pastyear'
};

export const getDate = (date) => {
	if (!date) {
		return null;
	}

	const dates = {
		[DATE_FILTER_VALUES.PAST_WEEK]: (d) => d.setDate(d.getDate() - 7),
		[DATE_FILTER_VALUES.PAST_MONTH]: (d) => d.setMonth(d.getMonth() - 1),
		[DATE_FILTER_VALUES.PAST_THREE_MONTHS]: d => d.setMonth(d.getMonth() - 3),
		[DATE_FILTER_VALUES.PAST_SIX_MONTHS]: d => d.setMonth(d.getMonth() - 6),
		[DATE_FILTER_VALUES.PAST_YEAR]: d => d.setFullYear(d.getFullYear() - 1)
	};

	return (dates[date] && Math.floor(dates[date](new Date()) / 1000)) || null;
};
