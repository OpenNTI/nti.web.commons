import React from 'react';

import {DateTime} from '../../../src';

export default class DateTimeTest extends React.Component {
	render () {
		return (
			<DateTime date={new Date()} />
		);
	}
}
