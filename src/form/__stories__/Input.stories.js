import React from 'react';
import PropTypes from 'prop-types';

import Input from '../Input';

export default {
	title: 'Form/Inputs',
	component: Input,
	argTypes: {
		disabled: { control: { type: 'boolean' } },
		underlined: { control: { type: 'boolean' } },
		fill: { control: { type: 'boolean' } },
		locked: { control: { type: 'boolean' } },

		label: { control: { type: 'text' } },
		placeholder: { control: { type: 'text' } },

		error: { control: { type: 'text' } },
	},
};

const InputName = 'text-input';
const makeError = msg => {
	const error = new Error(msg);
	error.field = InputName;

	return error;
};

Wrapper.propTypes = {
	disabled: PropTypes.bool,
	variant: PropTypes.string,
	fill: PropTypes.bool,
	locked: PropTypes.bool,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	error: PropTypes.string,
	children: PropTypes.any,
};
function Wrapper({
	disabled,
	underlined,
	fill,
	locked,
	label,
	error,
	placeholder,
	children,
}) {
	return React.cloneElement(React.Children.only(children), {
		name: InputName,
		disabled,
		underlined,
		fill,
		locked,
		label,
		placeholder,
		error: error && makeError(error),
	});
}

export const Text = props => (
	<Wrapper {...props}>
		<Input.Text />
	</Wrapper>
);
