import React from 'react';
import PropTypes from 'prop-types';
import { formatISO, parseJSON } from 'date-fns';

import { isEmpty } from '@nti/lib-commons';

import { DEFAULT, format, fromNow, fromWhen, isToday } from '../utils';
import Text from '../../text';

/**
 * @typedef {Object} DateTimeProps
 * @property {Date} date The date reference
 * @property {Date} relativeTo A anchor date reference to calculate relative formats with
 * @property {string} format The format to use
 * @property {string} prefix Prefix string
 * @property {string} suffix Postfix string
 * @property {boolean} showToday When the given date represents the current day, print text supplied by 'todayText'
 * @property {boolean} relative Enable relative formatting
 * @property {string} todayText Text to print when the date represents the current date.
 */

/**
 * @param {DateTimeProps} props
 * @param {any} ref
 * @returns {React.ReactElement}
 */
function DateTimeImpl(
	{
		date = new Date(),
		format: pattern = DEFAULT,
		prefix = void 0,
		suffix = void 0,
		showToday = false,
		relativeTo = void 0,
		relative = false,
		todayText = void 0,
		...otherProps
	},
	ref
) {
	if (date == null) {
		return null;
	}

	const suffixExplicitlySuppressed = suffix === false;
	const hasCustomSuffix = !isEmpty(suffix);
	const addSuffix = !suffixExplicitlySuppressed && !hasCustomSuffix;

	let text = relativeTo
		? fromWhen(date, relativeTo, { addSuffix })
		: relative
		? fromNow(date, { addSuffix })
		: format(date, pattern);

	if ((showToday || !isEmpty(todayText)) && isToday(date)) {
		text = (todayText || 'Today').replace('{time}', text);
	}

	const props = {
		...otherProps,
		dateTime: formatISO(date instanceof Date ? date : parseJSON(date)),
	};

	return (
		<Text.Base ref={ref} as="time" {...props}>
			{prefix || ''}
			{text}
			{suffix || ''}
		</Text.Base>
	);
}

/** @type {(props: DateTimeProps) => React.ReactElement} */
export const DateTime = React.forwardRef(DateTimeImpl);
DateTimeImpl.propTypes = DateTime.propTypes = {
	date: PropTypes.instanceOf(Date),
	relativeTo: PropTypes.instanceOf(Date),
	format: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
	relative: PropTypes.bool,
	prefix: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([false])]),
	suffix: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([false])]),
	showToday: PropTypes.bool,
	todayText: PropTypes.string,
};
