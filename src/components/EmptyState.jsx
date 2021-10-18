import './EmptyState.scss';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Notice from './Notice';

EmptyState.propTypes = {
	header: PropTypes.string,
	subHeader: PropTypes.string,
};
export default function EmptyState({ children, header, subHeader, className }) {
	if (children) {
		if (!header) {
			header = children;
			children = null;
		} else if (!subHeader) {
			subHeader = children;
			children = null;
		}
	}

	return (
		<Notice className={cx('empty-state-component', className)}>
			{header && <h1>{header}</h1>}
			{subHeader && <p>{subHeader}</p>}
			{children}
		</Notice>
	);
}
