import './EmptyState.scss';
import React from 'react';
import PropTypes from 'prop-types';

import Notice from './Notice';

EmptyState.propTypes = {
	header: PropTypes.string,
	subHeader: PropTypes.string,
};
export default function EmptyState({ header, subHeader }) {
	return (
		<Notice className="empty-state-component">
			{header && <h1>{header}</h1>}
			{subHeader && <p>{subHeader}</p>}
		</Notice>
	);
}
