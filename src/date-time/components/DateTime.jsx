import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from '@nti/lib-commons';
import {formatISO, parseJSON} from 'date-fns';

import {DEFAULT, format, fromNow, fromWhen, isToday} from '../utils';
import Text from '../../text';

const DateTime = React.forwardRef(DateTimeImpl);
export default DateTime;

DateTimeImpl.propTypes =
DateTime.propTypes = {
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
};

DateTimeImpl.defaultProps =
DateTime.defaultProps = {
	date: new Date(),
	relativeTo: undefined,
	format: DEFAULT,
	relative: false,
	prefix: undefined,
	suffix: undefined,
	showToday: false,
	todayText: undefined
};

function DateTimeImpl ({
	date,
	format: pattern,
	prefix,
	suffix,
	showToday,
	relativeTo,
	relative,
	todayText,
	...otherProps
}, ref) {

	if (date == null) {
		return null;
	}

	const suffixExplicitlySuppressed = suffix === false;
	const hasCustomSuffix = !isEmpty(suffix);
	const addSuffix = !suffixExplicitlySuppressed && !hasCustomSuffix;

	let text = relativeTo
		? fromWhen(date, relativeTo)
		: relative
			? fromNow(date, {addSuffix})
			: format(date, pattern);

	if ((showToday || !isEmpty(todayText)) && isToday(date)) {
		text = (todayText || 'Today').replace('{time}', text);
	}

	const props = { ...otherProps, dateTime: formatISO(date instanceof Date ? date : parseJSON(date))};

	return (
		<Text.Base ref={ref} as="time" {...props}>
			{prefix || ''}{text}{suffix || ''}
		</Text.Base>
	);
}
