import PropTypes from 'prop-types';

import Form from '../Form';

export default {
	title: 'Form/Prompt',
	component: Form.Prompt,
};

export const Playground = props => {
	const submit = ({ json }) => props.onSubmit(json);
	const cancel = props.allowCancel ? props.onCancel : null;

	return (
		<Form.Prompt onSubmit={submit} onCancel={cancel} {...props}>
			<Form.Input.Text name="input" label="Input" />
		</Form.Prompt>
	);
};

Playground.propTypes = {
	onSubmit: PropTypes.func,
	onCancel: PropTypes.func,
	allowCancel: PropTypes.bool,
};

Playground.argTypes = {
	onSubmit: { action: 'submitted' },
	onCancel: { action: 'canceled' },
	allowCancel: { control: { type: 'boolean' } },
	actionType: {
		control: {
			type: 'radio',
			options: ['destructive', 'constructive', 'dismissive'],
		},
	},
	actionLabel: { control: { type: 'text' } },
};
