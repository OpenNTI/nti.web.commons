import React from 'react';
import cx from 'classnames';

MessageBar.propTypes = {
	message: React.PropTypes.string,
	error: React.PropTypes.bool//TODO: actually style this case, this is just here as an example
};
export default function MessageBar ({message, error}) {
	const cls = cx('panels-message-bar', {error});

	return (
		<div className={cls}>
			{message}
		</div>
	);
}
