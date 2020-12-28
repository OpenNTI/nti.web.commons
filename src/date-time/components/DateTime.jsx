import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from '@nti/lib-commons';
import { formatDistanceStrict } from 'date-fns';

import {format, fromNow, isToday} from '../utils';
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
	format: 'LLLL d, yyyy',
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
	React.useImperativeHandle(ref, () => ({}));
	if (date == null) {
		return null;
	}

	const suffixExplicitlySuppressed = suffix === false;
	const hasCustomSuffix = !isEmpty(suffix);
	const omitSuffix = suffixExplicitlySuppressed || hasCustomSuffix;

	let text = relative
		? fromNow(date, omitSuffix)
		: relativeTo
			? formatDistanceStrict(date, relativeTo, {addSuffix: true})
			: format(date, pattern);

	if ((showToday || !isEmpty(todayText)) && isToday(date)) {
		text = (todayText || 'Today').replace('{time}', text);
	}

	const props = { ...otherProps, dateTime: format(date)};

	return (
		<Text.Base ref={ref} as="time" {...props}>
			{prefix || ''}{text}{suffix || ''}
		</Text.Base>
	);
}
