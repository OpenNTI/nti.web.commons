import React from 'react';

import DateTime from '../index';

export default {
	title: 'DateTime',
	component: DateTime,
	argTypes: {
		date: { control: 'date' },
		relativeTo: { control: 'date' },
		relative: {control: 'boolean'},
		format: { control: {
			type: 'select',
			options: Object.keys(DateTime).filter(x => typeof DateTime[x] === 'string'),
		}},
		prefix: {control: 'text'},
		suffix: {control: 'text'},
		showToday: {control: 'boolean'},
		todayText: {control: 'text'}
	},
};

// eslint-disable-next-line react/prop-types
export const Basic = ({format, ...props}) => (
	<DateTime date={new Date()} format={format ? DateTime[format] : void 0} {...props} />
);

export const Relative = () => (
	<>
		<DateTime date={new Date('2021-01-14T21:48:00Z')} relativeTo={new Date('2000-01-14T21:48:50Z')} /> <br/>
		<DateTime date={new Date('2021-01-14T21:48:00Z')} relativeTo={new Date('2022-01-14T21:48:50Z')} /> <br/>
		<DateTime date={new Date('2021-01-14T21:48:00Z')} relativeTo={new Date('2020-01-14T21:48:50Z')} suffix={', woh!'}/> <br/>
		<DateTime date={new Date('2021-01-14T21:48:00Z')} relativeTo={new Date('2020-01-14T21:48:50Z')} suffix={', woh!'}/> <br/>
		<DateTime date={new Date('2021-01-14T21:48:00Z')} relativeTo={new Date('2022-01-14T21:48:50Z')} suffix={false}/>
	</>
);

