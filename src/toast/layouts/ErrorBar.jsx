import React from 'react';
import PropTypes from 'prop-types';

import { getMessage } from '../../errors/messages';
import { Alert } from '../../icons/Alert';

import MessageBar from './MessageBar';

ErrorBar.propTypes = {
	error: PropTypes.any
};
export default function ErrorBar ({error, ...otherProps}) {
	return (
		<MessageBar
			error
			icon={<Alert />}
			message={getMessage(error)}
			{...otherProps}
		/>
	);
}
