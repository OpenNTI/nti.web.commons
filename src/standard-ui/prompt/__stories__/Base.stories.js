import PropTypes from 'prop-types';

import Base from '../Base';

export default {
	title: 'Prompts/Base',
	component: Base,
};

export const Playground = ({ onCancel, allowCancel, ...props }) => (
	<Base onCancel={allowCancel ? onCancel : null} {...props}>
		Test Prompt
	</Base>
);

Playground.propTypes = {
	onCancel: PropTypes.func,
	allowCancel: PropTypes.bool,
};

Playground.argTypes = {
	onAction: { action: 'action' },
	onCancel: { action: 'canceled' },
	cancelLabel: { control: { type: 'text' } },
	allowCancel: { control: { type: 'boolean' } },
	actionType: {
		control: {
			type: 'radio',
			options: ['destructive', 'constructive', 'dismissive'],
		},
	},
	actionLabel: { control: { type: 'text' } },
};
