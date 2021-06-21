import './EmptyState.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Notice from './Notice';

EmptyState.propTypes = {
	header: PropTypes.string,
	subHeader: PropTypes.string,
};
export default function EmptyState({ header, subHeader, className }) {
	return (
		<Notice className={cx('empty-state-component', className)}>
			{header && <h1>{header}</h1>}
			{subHeader && <p>{subHeader}</p>}
		</Notice>
	);
}
