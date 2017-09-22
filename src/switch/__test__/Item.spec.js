/* eslint-env jest */
import React from 'react';
import {shallow} from 'enzyme';

import Item from '../Item';

function TestCmp () {
	return (
		<div>Test Cmp</div>
	);
}

describe('Switch Item', () => {
	test('Does not render the component if not active', () => {
		const item = shallow((<Item name="inactive" active="active" component={TestCmp} />));

		expect(item.find(TestCmp).exists()).toBeFalsy();
	});

	test('Does render the component if active', () => {
		const item = shallow((<Item name="active" active="active" component={TestCmp} />));

		expect(item.find(TestCmp).exists()).toBeTruthy();
	});

	test('Passes props to the component', () => {
		const otherProps = {foo: 'bar', bar: 'foo'};
		const item = shallow((<Item name="active" active="active" component={TestCmp} {...otherProps} />));
		const cmp = item.find(TestCmp);

		expect(cmp.props()).toEqual(otherProps);
	});
});
