/* eslint-env jest */
import { render, waitFor } from '@testing-library/react';

import URL from '../URL';

describe('URL Input', () => {
	test('attaches ref', async () => {
		let instance = null;
		render(<URL ref={x => (instance = x)} />);

		return waitFor(() => {
			expect(instance.input).toBeTruthy();
			expect(instance).toHaveProperty('focus');
			expect(instance).toHaveProperty('validity');
		});
	});
});
