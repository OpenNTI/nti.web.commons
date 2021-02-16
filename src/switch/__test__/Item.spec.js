/* eslint-env jest */
import React from 'react';
import { render } from '@testing-library/react';

import Item from '../Item';

function TestCmp() {
	return <div data-test-item>Test Cmp</div>;
}

describe('Switch Item', () => {
	test('Does not render the component if not active', () => {
		const item = render(
			<Item name="inactive" active="active" component={TestCmp} />
		);

		expect(item.container.querySelector('[data-test-item]')).toBeFalsy();
	});

	test('Does render the component if active', () => {
		const item = render(
			<Item name="active" active="active" component={TestCmp} />
		);

		expect(item.container.querySelector('[data-test-item]')).toBeTruthy();
	});

	test('Passes props to the component', () => {
		let passedProps;
		const otherProps = { foo: 'bar', bar: 'foo' };
		const Cmp = props => {
			passedProps = props;
			return null;
		};

		render(
			<Item
				name="active"
				active="active"
				component={Cmp}
				{...otherProps}
			/>
		);

		expect(passedProps).toEqual(otherProps);
	});
});
