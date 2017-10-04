/* eslint-env jest */
import React from 'react';
import {mount} from 'enzyme';

import Toggle from '../Toggle';

describe('Toggle Input', () => {
	test('Test default state', (done) => {
		const onChange = jest.fn();

		const cmp = mount(<Toggle onChange={onChange}/>);

		let toggleLabel = cmp.find('.toggle-label').first();
		let toggler = cmp.find('.toggler').first();
		let toggleButton = cmp.find('.toggle-button').first();

		expect(toggleLabel.prop('className')).not.toMatch(/ on/);
		expect(toggler.prop('className')).not.toMatch(/ on/);
		expect(toggleButton.prop('className')).not.toMatch(/ on/);

		expect(toggleLabel.prop('className')).toMatch(/ off/);
		expect(toggler.prop('className')).toMatch(/ off/);
		expect(toggleButton.prop('className')).toMatch(/ off/);

		expect(toggleLabel.text()).toEqual('Off');

		// simulate toggling ON
		toggler.find('input').simulate('change', { target: { checked: true } });

		const verifyCalled = () => {
			expect(onChange).toHaveBeenCalledWith(true);

			done();
		};

		setTimeout(verifyCalled, 300);
	});

	test('Test provided value', (done) => {
		const onChange = jest.fn();

		const cmp = mount(<Toggle className="test-name" value onChange={onChange}/>);

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

		expect(toggleLabel.text()).toEqual('On');

		// simulate toggling OFF
		toggler.find('input').simulate('change', { target: { checked: false } });

		const verifyCalled = () => {
			expect(onChange).toHaveBeenCalledWith(false);

			done();
		};

		setTimeout(verifyCalled, 300);
	});

	test('Test hide label', () => {
		const cmp = mount(<Toggle hideLabel/>);

		// label should not appear, but toggler should still be there
		expect(cmp.find('.toggle-label').exists()).toBeFalsy();
		expect(cmp.find('.toggler').exists()).toBeTruthy();
	});
});
