import React from 'react';

import Text from './Text';

function Hidden(props, ref) {
	return <Text {...props} type="hidden" ref={ref} />;
}

export default React.forwardRef(Hidden);
