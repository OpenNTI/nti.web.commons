import React from 'react';
import cx from 'classnames';

Error.propTypes = {
	className: React.PropTypes.string,
	error: React.PropTypes.string,
	white: React.PropTypes.bool
};
export default function Error ({className, error, white}) {
	const cls = cx(className, 'association-error', {white});

	return (
		<div className={cls}>
			<i className="icon-alert" />
			<span>{error}</span>
		</div>
	);
}
