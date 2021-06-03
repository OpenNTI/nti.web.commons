/* eslint-env jest */
import React from 'react';
import { render, act, fireEvent, waitFor } from '@testing-library/react';

import Tooltip from '../Tooltip';

test('Tooltip', async () => {
	const { getByText, queryByText } = render(
		<Tooltip label="tooltip label">
			<button>button label</button>
		</Tooltip>
	);

	act(() => {
		fireEvent.mouseOver(getByText('button label'));
	});

	await waitFor(() => expect(queryByText('tooltip label')).toBeTruthy());

	act(() => {
		fireEvent.mouseOut(getByText('button label'));
	});

	await waitFor(() => expect(queryByText('tooltip label')).toBeNull());
});
