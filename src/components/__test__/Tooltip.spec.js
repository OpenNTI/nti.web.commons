/* eslint-env jest */
import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';

import Tooltip from '../Tooltip';

test('Tooltip', () => {
	jest.useFakeTimers();

	const { getByText, queryByText } = render(
		<Tooltip label="tooltip label">
			<button>button label</button>
		</Tooltip>
	);

	act(() => {
		fireEvent.mouseOver(getByText('button label'));
		jest.runAllTimers();
	});

	expect(queryByText('tooltip label')).toBeTruthy();

	act(() => {
		fireEvent.mouseOut(getByText('button label'));
		jest.runAllTimers();
	});

	expect(queryByText('tooltip label')).toBeNull();
});
