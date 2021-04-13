import React from 'react';

import { DisplayName } from '../components';

/**
 * Convenance helpers to reduce imports on commons if you just need User.x stuff
 *
 * @param {*} props
 * @returns {React.ReactElement}
 */
export default function UserDisplayName({
	/**
	 * @deprecated use entity instead
	 */
	user,
	...props
}) {
	return <DisplayName entity={user} {...props} />;
}
