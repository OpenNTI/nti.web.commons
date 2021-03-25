import React from 'react';
import PropTypes from 'prop-types';

import { Avatar } from '../components';

UserAvatar.propTypes = {
	user: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};
export default function UserAvatar({ user, ...props }) {
	return <Avatar entity={user} {...props} />;
}
