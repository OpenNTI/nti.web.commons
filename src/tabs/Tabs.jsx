import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Tabs.css';

const cx = classnames.bind(Styles);

export default function Tabs({ children, className, active: a = 0, onChange }) {
	return (
		<ul className={cx('nti-tabs', className)}>
			{React.Children.map(children, (c, i) => {
				const active = a === i;
				return (
					<li
						key={i}
						className={cx('test', { active })}
						onClick={() => onChange(i)}
					>
						{active ? React.cloneElement(c, { active: true }) : c}
					</li>
				);
			})}
		</ul>
	);
}

Tabs.propTypes = {
	active: PropTypes.number,
	onChange: PropTypes.func.isRequired,
	className: PropTypes.string,
};
