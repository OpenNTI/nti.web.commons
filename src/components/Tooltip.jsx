import React from 'react';
import Tooltip from '@reach/tooltip';

import {Text} from '..';

export default styled(Tooltip).attrs(({label, ...props}) => ({
	...props,
	label: typeof label === 'string' ? <Text>{label}</Text> : label,
})
)`
		background-color: var(--primary-grey);
		padding: 3px 5px;
		box-shadow: 1px 2px 5px 0 rgba(0, 0, 0, 0.25);
		text-transform: uppercase;
		color: #FFFFFF;
		font-size: 11px;
		font-weight: 600;
`;
