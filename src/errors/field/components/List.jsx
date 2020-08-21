import './List.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import ListItem from './ListItem';

function renderListItem (error, isWarning, onErrorFocus) {
	return (
		<ListItem key={error.ID} error={error} isWarning={isWarning} onErrorFocus={onErrorFocus} />
	);
}

const DEFAULT_EMPTY_TEXT = 'No Issues';

ErrorList.propTypes = {
	errors: PropTypes.array,
	isWarnings: PropTypes.bool,
	emptyText: PropTypes.string,
	onErrorFocus: PropTypes.func
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
