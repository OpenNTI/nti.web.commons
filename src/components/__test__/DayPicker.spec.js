import React from 'react';
import {shallow, mount} from 'enzyme';

import DayPicker from '../DayPicker';

describe('DayPicker', () => {
	const sharedWrapper = shallow(<DayPicker />);

	const test = (props, ...children) => [
		shallow(<DayPicker {...props} children={children}/>),
		sharedWrapper.setProps({...props, children})
	];

	it('Base case: Day Prop passed is Day State', () => {
		const now = new Date();

		test({value: now})
			.map(x => x.state('value'))
			.forEach(value => {
				expect(value.getHours()).toEqual(now.getHours());
				expect(value.getMinutes()).toEqual(now.getMinutes());
				expect(value.getDate()).toEqual(now.getDate());
				expect(value.getMonth()).toEqual(now.getMonth());
				expect(value.getYear()).toEqual(now.getYear());
			});
	});

	it('Simulate Selecting a Day', () => {
		// TODO: Implament me
		// const onChange = jasmine.createSpy('onChange');
		// const date = new Date();
		// const wrapper = mount(<DayPicker value={date} onChange={onChange} />);
	});
});
