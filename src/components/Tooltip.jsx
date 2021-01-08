import PropTypes from 'prop-types';
import React from 'react';
import Tooltip from '@reach/tooltip';

import {Text} from '..';

const styles = css`
	.tooltip {
		background-color: var(--primary-grey);
		padding: 3px 5px;
		box-shadow: 1px 2px 5px 0 rgba(0, 0, 0, 0.25);
		text-transform: uppercase;
		color: #FFFFFF;
		font-size: 11px;
		font-weight: 600;
	}
`;

NTITooltip.propTypes = {
	label: PropTypes.any.isRequired,
};

export default function NTITooltip ({ label:labelProp, children }) {
	const isString = typeof labelProp === 'string';

	const label = isString ? <Text>{labelProp}</Text> : labelProp;

	return (
		<Tooltip label={label} style={styles.tooltip}>
			{children}
		</Tooltip>
	);
}
