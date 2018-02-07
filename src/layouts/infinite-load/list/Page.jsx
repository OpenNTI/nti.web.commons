import React from 'react';
import PropTypes from 'prop-types';

InfiniteLoadListPage.propTypes = {
	pageKey: PropTypes.string.isRequired,
	pageIndex: PropTypes.number.isRequired,
	pageHeight: PropTypes.number.isRequired,
	renderPage: PropTypes.func.isRequired
};
export default function InfiniteLoadListPage ({pageKey, pageIndex, pageHeight, renderPage}) {
	return (
		<div className="infinite-load-list-page" data-page-key={pageKey}>
			{renderPage({pageIndex, pageKey, pageHeight})}
		</div>
	);
}
