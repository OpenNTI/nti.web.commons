/* eslint-env jest */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Clearable from '../Clearable';
import Text from '../Text';

describe('Clearable Inputs', () => {
	function buildProps(props) {
		const newProps = { ...props, onChange: () => {} };

		jest.spyOn(newProps, 'onChange');

		return newProps;
	}

	test('No onClear calls onChange with null on the input', () => {
		const inputProps = buildProps({});
		const clearProps = buildProps({});

		const { container } = render(
			<Clearable {...clearProps}>
				<Text {...inputProps} />
			</Clearable>
		);
		const clearButton = container.querySelector('.reset');

		fireEvent.click(clearButton);

		expect(inputProps.onChange).toHaveBeenCalledWith(null);
	});

	test('onClear is called when present and onChange is not', () => {
		const inputProps = buildProps({});
		const clearProps = buildProps({ onClear: () => {} });

		jest.spyOn(clearProps, 'onClear');

		const { container } = render(
			<Clearable {...clearProps}>
				<Text {...inputProps} />
			</Clearable>
		);
		const clearButton = container.querySelector('.reset');

		fireEvent.click(clearButton);

		expect(clearProps.onClear).toHaveBeenCalled();
		expect(inputProps.onChange).not.toHaveBeenCalled();
	});
});
