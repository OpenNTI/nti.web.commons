/* eslint-env jest */
import React from 'react';
import { render as _render, fireEvent } from '@testing-library/react';

import Trigger from '../Trigger';

function TriggerCmp() {
	return <div>Trigger Cmp</div>;
}

function buildContext(activeItem = '', availableItems = {}) {
	const context = {
		switchContext: {
			setActiveItem: () => {},
			activeItem,
			availableItems,
		},
	};

	jest.spyOn(context.switchContext, 'setActiveItem');

	return context;
}

class Context extends React.Component {
	static childContextTypes = {
		switchContext: () => {},
	};

	getChildContext() {
		return this.props.value;
	}

	render() {
		return this.props.children;
	}
}

function render(props, context) {
	const Wrapper = context ? Context : React.Fragment;
	return _render(
		<Wrapper value={context}>
			<Trigger {...props}>
				<TriggerCmp />
			</Trigger>
		</Wrapper>
	);
}

describe('Switch Trigger', () => {
	describe('disabled class', () => {
		test('Adds class if item is not in the available', () => {
			const { container } = render(
				{ item: 'unavailable' },
				buildContext()
			);
			const item = container.querySelector('[data-trigger-element]');

			expect(item.classList.contains('disabled')).toBeTruthy();
		});

		test('Does not add class if the item is available', () => {
			const { container } = render(
				{ item: 'available' },
				buildContext('', { available: true })
			);
			const item = container.querySelector('[data-trigger-element]');

			expect(item.classList.contains('disabled')).toBeFalsy();
		});
	});

	describe('active', () => {
		test('Adds class if item is active', () => {
			const { container } = render(
				{ item: 'active' },
				buildContext('active', { active: true })
			);
			const item = container.querySelector('[data-trigger-element]');

			expect(item.classList.contains('active')).toBeTruthy();
		});

		test('Does not add class if the item is not active', () => {
			const { container } = render(
				{ item: 'not-active' },
				buildContext('active', { 'not-active': true })
			);
			const item = container.querySelector('[data-trigger-element]');
			expect(item.classList.contains('active')).toBeFalsy();
		});
	});

	describe('triggering', () => {
		describe('No Action prop', () => {
			test('Calls setActiveItem in context', () => {
				const context = buildContext('', { active: true });
				const { container } = render({ item: 'active' }, context);
				const item = container.querySelector('[data-trigger-element]');
				fireEvent.click(item);

				expect(
					context.switchContext.setActiveItem
				).toHaveBeenCalledWith('active');
			});

			test('Calls onClick', () => {
				const onClick = jest.fn();
				const { container } = render(
					{ item: 'active', onClick },
					buildContext('', { active: true })
				);
				const item = container.querySelector('[data-trigger-element]');
				fireEvent.click(item);

				expect(onClick).toHaveBeenCalled();
			});
		});

		//TODO:add tests for when there is an action passed to the trigger
	});
});
