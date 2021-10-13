/* eslint-env jest */
import { render, fireEvent } from '@testing-library/react';

import Text from '../Text';

describe('Text Input', () => {
	test('attaches ref', () => {
		let instance;
		const { container } = render(<Text ref={x => (instance = x)} />);
		const input = container.querySelector('input');

		expect(instance.input).toEqual(input);
	});

	describe('onChange', () => {
		let result;
		let props;

		beforeEach(() => {
			props = {
				onChange: () => {},
				value: 'test',
			};

			jest.spyOn(props, 'onChange');

			result = render(<Text {...props} />);
		});

		test('Change to the input triggers the on change callback', () => {
			const input = result.container.querySelector('input');

			fireEvent.change(input, { target: { value: 'new' } });

			expect(props.onChange).toHaveBeenCalledWith(
				'new',
				expect.any(Object)
			);
		});

		test('Setting new prop updates input', () => {
			let input = result.container.querySelector('input');

			expect(input.value).toEqual('test');

			result.rerender(<Text {...props} value="new" />);
			input = result.container.querySelector('input');
			expect(input.value).toEqual('new');
		});
	});

	// describe('clear', () => {
	// 	test('Clear calls on change', () => {
	// 		const props = {onChange: () => {}};
	// 		spyOn(props, 'onChange');

	// 		const result = render(<Text {...props} />);

	// 		const clear = result.container.querySelector('.reset');

	// 		fireEvent.click(clear);

	// 		expect(props.onChange).toHaveBeenCalledWith('');
	// 	});

	// 	it('Disable Clear doesn\'t render the button', () => {
	// 		const result = render(<Text disableClear />);
	// 		const clear = result.container.querySelectorAll('.reset');

	// 		expect(clear.length).toEqual(0);
	// 	});
	// });

	// describe('label', () => {
	// 	it('Renders label', () => {
	// 		const result = render(<Text label="label" />);
	// 		const label = result.container.querySelector('.label');

	// 		expect(label.textContent).toEqual('label');
	// 	});

	// 	it('Doesn\'t render label', () => {
	// 		const result = render(<Text />);
	// 		const label = result.container.querySelectorAll('.label');

	// 		expect(label.length).toEqual(0);
	// 	});
	// });
});
