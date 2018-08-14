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

	const d = new Date();
	const dates = {
		[DATE_FILTER_VALUES.PAST_WEEK]: d.setDate(d.getDate() - 7),
		[DATE_FILTER_VALUES.PAST_MONTH]: d.setMonth(d.getMonth() - 1),
		[DATE_FILTER_VALUES.PAST_THREE_MONTHS]: d.setMonth(d.getMonth() - 3),
		[DATE_FILTER_VALUES.PAST_SIX_MONTHS]: d.setMonth(d.getMonth() - 6),
		[DATE_FILTER_VALUES.PAST_YEAR]: d.setFullYear(d.getFullYear() - 1)
	};

	return dates[date];
};
