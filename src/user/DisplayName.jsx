import React from 'react';
import PropTypes from 'prop-types';

import { DisplayName } from '../components';

export default class UserDisplayName extends React.Component {
	static propTypes = {
		user: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
	};

	render() {
		const { user, ...otherProps } = this.props;

		return <DisplayName {...otherProps} entity={user} />;
	}
}
