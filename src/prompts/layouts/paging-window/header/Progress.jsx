import PropTypes from 'prop-types';

import Styles from './Styles.css';

const getProgressWidth = p => `${Math.floor((p ?? 0) * 100)}%`;

Progress.propTypes = {
	progress: PropTypes.number,
};
export default function Progress({ progress }) {
	if (progress == null) {
		return null;
	}

	return (
		<div
			className={Styles.progressBar}
			style={{ width: getProgressWidth(progress) }}
		/>
	);
}
