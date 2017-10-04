/* eslint-env jest */
import React from 'react';
import {mount} from 'enzyme';

import Toggle from '../Toggle';

describe('Toggle Input', () => {
	test('Test default state', (done) => {
		const onValueChange = jest.fn();

		const cmp = mount(<Toggle onValueChange={onValueChange}/>);

		let toggleLabel = cmp.find('.toggle-label').first();
		let toggler = cmp.find('.toggler').first();
		let toggleButton = cmp.find('.toggle-button').first();

		expect(toggleLabel.prop('className')).not.toMatch(/ on/);
		expect(toggler.prop('className')).not.toMatch(/ on/);
		expect(toggleButton.prop('className')).not.toMatch(/ on/);

		expect(toggleLabel.prop('className')).toMatch(/ off/);
		expect(toggler.prop('className')).toMatch(/ off/);
		expect(toggleButton.prop('className')).toMatch(/ off/);

		expect(toggleLabel.text()).toEqual('OFF');

		// click to toggle to ON
		toggler.simulate('click');

		const verifyCalled = () => {
			expect(onValueChange).toHaveBeenCalledWith(true);

			done();
		};

		setTimeout(verifyCalled, 300);
	});

	test('Test provided value', (done) => {
		const onValueChange = jest.fn();

		const cmp = mount(<Toggle className="test-name" value onValueChange={onValueChange}/>);

		let toggleLabel = cmp.find('.toggle-label').first();
		let toggler = cmp.find('.toggler').first();
		let toggleButton = cmp.find('.toggle-button').first();

		expect(cmp.prop('className')).toMatch(/test-name/);

		expect(toggleLabel.prop('className')).toMatch(/ on/);
		expect(toggler.prop('className')).toMatch(/ on/);
		expect(toggleButton.prop('className')).toMatch(/ on/);

		expect(toggleLabel.prop('className')).not.toMatch(/ off/);
		expect(toggler.prop('className')).not.toMatch(/ off/);
		expect(toggleButton.prop('className')).not.toMatch(/ off/);

		expect(toggleLabel.text()).toEqual('ON');

		// click to toggle to OFF
		toggler.simulate('click');

		const verifyCalled = () => {
			expect(onValueChange).toHaveBeenCalledWith(false);

			done();
		};

		setTimeout(verifyCalled, 300);
	});
});
