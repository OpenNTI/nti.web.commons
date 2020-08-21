import './Error.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

Error.propTypes = {
	className: PropTypes.string,
	error: PropTypes.string,
	white: PropTypes.bool
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
