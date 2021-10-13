import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { filterProps } from '../utils';

import styles from './Tab.css';

const cx = classnames.bind(styles);

export default function Tab({ label, active, className, ...props }) {
	return (
		<div
			className={cx('nti-tab', { active }, className)}
			{...filterProps(props, 'div')}
		>
			{label}
		</div>
	);
}

Tab.propTypes = {
	label: PropTypes.node,
	active: PropTypes.bool,
};
