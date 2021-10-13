import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Progress.css';

const cx = classnames.bind(Styles);

function getPercentage(value, max) {
	if (max === 0) {
		return 0;
	}
	if (value === max) {
		return 100;
	}

	return Math.round((value / (max || 1)) * 100);
}

Progress.propTypes = {
	className: PropTypes.string,
	value: PropTypes.number.isRequired,
	max: PropTypes.number.isRequired,
};
export default function Progress({ className, value, max }) {
	return (
		<progress
			className={cx(className, 'nti-progress')}
			value={value}
			max={max}
		>
			<div className={cx('progress-bar-fallback')}>
				<span style={{ width: `${getPercentage(value, max)}%` }} />
			</div>
		</progress>
	);
}
