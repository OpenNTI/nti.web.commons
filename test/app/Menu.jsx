import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import style from './Menu.css';

const cx = classnames.bind(style);

export default function Menu ({items}) {
	const [open, setOpen] = React.useState(true);

	return (
		<ul className={cx('menu', {open})} onClick={() => setOpen(!open)}>
			{Object.entries(items).map(([name, component]) => (
				<li key={name}><a href={`#${name}`}>{component.displayName || name}</a></li>
			))}
		</ul>
	);
}

Menu.propTypes = {
	items: PropTypes.object.isRequired
};
