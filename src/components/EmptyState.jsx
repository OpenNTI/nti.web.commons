import React from 'react';

import Notice from './Notice';

EmptyState.propTypes = {
	header: React.PropTypes.string,
	subHeader: React.PropTypes.string
};
export default function EmptyState ({header, subHeader}) {
	return (
		<Notice className="empty-state-component">
			{header && (<h1>{header}</h1>)}
			{subHeader && (<p>{subHeader}</p>)}
		</Notice>
	);
}
