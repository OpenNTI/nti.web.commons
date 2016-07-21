import React from 'react';
import cx from 'classnames';

import ListItem from './ListItem';

function renderListItem (error, isWarning, onErrorFocus) {
	return (
		<ListItem key={error.ID} error={error} isWarning={isWarning} onErrorFocus={onErrorFocus} />
	);
}

const DEFAULT_EMPTY_TEXT = 'No Issues';

ErrorList.propTypes = {
	errors: React.PropTypes.array,
	isWarnings: React.PropTypes.bool,
	emptyText: React.PropTypes.string,
	onErrorFocus: React.PropTypes.func
};

function ErrorList ({errors = [], isWarnings, emptyText = DEFAULT_EMPTY_TEXT, onErrorFocus}) {
	const cls = cx('nti-error-list', {warnings: isWarnings, empty: !errors.length});

	return (
		<div className={cls}>
			{
				!errors.length ?
					emptyText :
					errors.map((x) => renderListItem(x, isWarnings, onErrorFocus))
			}
		</div>
	);
}

export default ErrorList;
