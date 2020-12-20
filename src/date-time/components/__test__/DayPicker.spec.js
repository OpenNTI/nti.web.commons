/* eslint-env jest */
import React from 'react';
import { render } from '@testing-library/react';

import DayPicker from '../DayPicker';

describe('DayPicker', () => {
	const sharedRef = React.createRef();
	const sharedWrapper = render(<DayPicker ref={sharedRef}/>);
	const testRender = (props, ...children) => {
		const ref = React.createRef();
		return [
			{ref, ...render(<DayPicker ref={ref} {...props}>{children}</DayPicker>)},
			{ref: sharedRef, ...(sharedWrapper.rerender(<DayPicker ref={sharedRef} {...props}>{children}</DayPicker>),sharedWrapper)}
		];
	};

	test('Base case: Day Prop passed is Day State', () => {
		const now = new Date();

		testRender({value: now})
			.map(x => x.ref.current.state.value)
			.forEach(value => {
				expect(value.getHours()).toEqual(now.getHours());
				expect(value.getMinutes()).toEqual(now.getMinutes());
				expect(value.getDate()).toEqual(now.getDate());
				expect(value.getMonth()).toEqual(now.getMonth());
				expect(value.getYear()).toEqual(now.getYear());
			});
	});

	test.skip('Simulate Selecting a Day', () => {
		// TODO: Implament me
		// const onChange = jest.fn();
		// const date = new Date();
		// const wrapper = mount(<DayPicker value={date} onChange={onChange} />);
	});
});
