import PropTypes from 'prop-types';

import { Icons } from '@nti/web-core';

import { getMessage } from '../../errors/messages';

import MessageBar from './MessageBar';

ErrorBar.propTypes = {
	error: PropTypes.any,
};
export default function ErrorBar({ error, ...otherProps }) {
	return (
		<MessageBar
			error
			icon={<Icons.Alert />}
			message={getMessage(error)}
			{...otherProps}
		/>
	);
}
