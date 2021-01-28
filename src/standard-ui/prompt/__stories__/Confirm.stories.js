import React from 'react';
import PropTypes from 'prop-types';

import Confirm from '../Confirm';

export default {
	title: 'Prompts/Confirms',
	component: Confirm
};

export const Playground = ({onCancel, allowCancel, onConfirm, allowConfirm, ...props}) => (
	<Confirm
		onCancel={allowCancel ? onCancel : null}
		onConfirm={allowConfirm ? onConfirm : null}
		{...props}
	/>
);
Playground.propTypes = {
	onCancel: PropTypes.func,
	allowCancel: PropTypes.bool,
	onConfirm: PropTypes.func,
	allowConfirm: PropTypes.bool
};

Playground.argTypes = {
	onConfirm: {action: 'confirmed'},
	onCancel: {action: 'canceled'},
	title: {control: {type: 'text'}},
	body: {control: {type: 'text'}},
	destructive: {control: {type: 'boolean'}},
	allowCancel: {control: {type: 'boolean'}},
	allowConfirm: {control: {type: 'boolean'}}
};
