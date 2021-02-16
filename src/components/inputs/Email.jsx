import React from 'react';

import Text from './Text';

function Email(props, ref) {
	return <Text {...props} type="email" ref={ref} />;
}

export default React.forwardRef(Email);
