import React from 'react';
import PropTypes from 'prop-types';

import { Avatar } from '../components';

export default class UserAvatar extends React.PureComponent {
	static propTypes = {
		user: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
	};

	render() {
		const { user, ...otherProps } = this.props;

		return <Avatar {...otherProps} entity={user} />;
	}
}
