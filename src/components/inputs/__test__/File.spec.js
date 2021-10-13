/* eslint-env jest */
import { render, fireEvent, waitFor } from '@testing-library/react';

import File from '../File';

describe('File Input', () => {
	test('clears file', async () => {
		let cmp = null;
		const { container } = render(
			<File ref={x => (cmp = x)} label="testLabel" />
		);

		cmp.setState({ file: { name: 'testFile' } });

		expect(cmp.state.file).toBeDefined();

		const clearButton = container.querySelector('.file-select-reset');

		fireEvent.click(clearButton);

		return waitFor(() => expect(cmp.state.file).toBeUndefined());
	});

	test('has correct contents', async () => {
		let cmp = null;
		const { container } = render(
			<File
				ref={x => (cmp = x)}
				label="choose a file"
				defaultText="this is the default"
			/>
		);

		expect(container.textContent).toMatch(/this is the default/);
		expect(container.querySelectorAll('.file-select-reset').length).toBe(0);

		cmp.setState({ file: { name: 'testFile' } });

		return waitFor(() => {
			expect(container.textContent).toMatch(/choose a file/);
			expect(
				container.querySelectorAll('.file-select-reset').length
			).toBe(1);
		});
	});

	test('calls on change', async () => {
		const onFileChange = jest.fn();
		const { container } = render(
			<File
				label="choose a file"
				defaultText="this is the default"
				onFileChange={onFileChange}
			/>
		);

		const fileInput = container.querySelectorAll('input[type="file"]');

		expect(fileInput.length).toBe(1);

		fireEvent.change(fileInput[0], {
			target: {
				files: [
					new File(['(⌐□_□)'], 'chucknorris.png', {
						type: 'image/png',
					}),
				],
			},
		});

		return waitFor(() => expect(onFileChange).toHaveBeenCalled());
	});
});
