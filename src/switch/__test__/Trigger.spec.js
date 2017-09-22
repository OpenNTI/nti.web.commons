/* eslint-env jest */
import React from 'react';
import {shallow} from 'enzyme';

import Trigger from '../Trigger';

function TriggerCmp () {
	return (
		<div>Trigger Cmp</div>
	);
}

function buildContext (activeItem = '', availableItems = {}) {
	const context = {
		switchContext: {
			setActiveItem: () => {},
			activeItem, availableItems
		}
	};

	jest.spyOn(context.switchContext, 'setActiveItem');

	return context;
}

function render (props, context) {
	return shallow((
		<Trigger {...props}>
			<TriggerCmp />
		</Trigger>
	), {context});
}

describe('Switch Trigger', () => {
	describe('disabled class', () => {
		test('Adds class if item is not in the available', () => {
			const item = render({item: 'unavailable'}, buildContext());

			expect(item.hasClass('disabled')).toBeTruthy();
		});

		test('Does not add class if the item is available', () => {
			const item = render({item: 'available'}, buildContext('', {'available': true}));

			expect(item.hasClass('disabled')).toBeFalsy();
		});
	});

	describe('active', () => {
		test('Adds class if item is active', () => {
			const item = render({item: 'active'}, buildContext('active', {active: true}));

			expect(item.hasClass('active')).toBeTruthy();
		});

		test('Does not add class if the item is not active', () => {
			const item = render({item: 'not-active'}, buildContext('active', {'not-active': true}));

			expect(item.hasClass('active')).toBeFalsy();
		});
	});

	describe('triggering', () => {
		describe('No Action prop', () => {
			test('Calls setActiveItem in context', () => {
				const context = buildContext('', {active: true});
				const item = render({item: 'active'}, context);

				item.simulate('click');

				expect(context.switchContext.setActiveItem).toHaveBeenCalledWith('active');
			});

			test('Calls onClick', () => {
				const onClick = jest.fn();
				const item = render({item: 'active', onClick}, buildContext('', {active: true}));

				item.simulate('click');

				expect(onClick).toHaveBeenCalled();
			});
		});

		//TODO:add tests for when there is an action passed to the trigger
	});
});
