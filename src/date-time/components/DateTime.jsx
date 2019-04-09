import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from '@nti/lib-commons';

import moment from '../moment';

const returnFalse = () => false;


export default class DateTime extends React.Component {

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
		this.state = {tz: moment.tz.guess()};
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

		const props = { ...otherProps, dateTime: moment(date).format()};

		return (<time {...props}>{text}</time>);
	}
}
