/* eslint-env jest */
import { render, fireEvent, waitFor } from '@testing-library/react';

import Toggle from '../Toggle';

describe('Toggle Input', () => {
	test('Test default state', async () => {
		const onChange = jest.fn();

		const { container } = render(<Toggle onChange={onChange} />);

		const toggleLabel = container.querySelector('.toggle-label');
		const toggler = container.querySelector('.toggler');
		const toggleButton = container.querySelector('.toggle-button');

		expect(toggleLabel.getAttribute('class')).not.toMatch(/ on/);
		expect(toggler.getAttribute('class')).not.toMatch(/ on/);
		expect(toggleButton.getAttribute('class')).not.toMatch(/ on/);

		expect(toggleLabel.getAttribute('class')).toMatch(/ off/);
		expect(toggler.getAttribute('class')).toMatch(/ off/);
		expect(toggleButton.getAttribute('class')).toMatch(/ off/);

		expect(toggleLabel.textContent).toEqual('Off');

		// simulate toggling ON
		fireEvent.click(toggler.querySelector('input'));

		return waitFor(() => {
			expect(onChange).toHaveBeenCalledWith(true);
		});
	});

	test('Test provided value', async () => {
		const onChange = jest.fn();
		const { container } = render(
			<Toggle className="test-name" value onChange={onChange} />
		);

		let toggleLabel = container.querySelector('.toggle-label');
		let toggler = container.querySelector('.toggler');
		let toggleButton = container.querySelector('.toggle-button');

		expect(toggleLabel.getAttribute('class')).toMatch(/ on/);
		expect(toggler.getAttribute('class')).toMatch(/ on/);
		expect(toggleButton.getAttribute('class')).toMatch(/ on/);

		expect(toggleLabel.getAttribute('class')).not.toMatch(/ off/);
		expect(toggler.getAttribute('class')).not.toMatch(/ off/);
		expect(toggleButton.getAttribute('class')).not.toMatch(/ off/);

		expect(toggleLabel.textContent).toEqual('On');

		// simulate toggling OFF
		fireEvent.click(toggler.querySelector('input'));

		return waitFor(() => {
			expect(onChange).toHaveBeenCalledWith(false);
		});
	});

	test('Test hide label', () => {
		const { container } = render(<Toggle hideLabel />);

		// label should not appear, but toggler should still be there
		expect(container.querySelector('.toggle-label')).toBeFalsy();
		expect(container.querySelector('.toggler')).toBeTruthy();
	});
});
