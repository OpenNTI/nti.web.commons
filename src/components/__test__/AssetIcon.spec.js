/* eslint-env jest */
import { render } from '@testing-library/react';

import AssetIcon from '../AssetIcon';

describe('AssetIcon', () => {
	test("should render a 'jpeg' label", () => {
		const { container } = render(<AssetIcon mimeType="image/jpeg" />);
		expect(container.querySelectorAll('.file-type label').length === 1);
		expect(container.querySelector('label').textContent).toEqual('jpeg');
	});
});
