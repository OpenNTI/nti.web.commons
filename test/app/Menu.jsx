import { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import style from './Menu.css';

const cx = classnames.bind(style);

export default function Menu({ items, selected }) {
	const [open, setOpen] = useState(!selected);

	return (
		<ul className={cx('menu', { open })} onClick={() => setOpen(!open)}>
			{Object.entries(items).map(([name, component]) => (
				<li key={name} className={cx({ active: selected === name })}>
					<a href={`#${name}`}>{component.displayName || name}</a>
				</li>
			))}
		</ul>
	);
}

Menu.propTypes = {
	items: PropTypes.object.isRequired,
	selected: PropTypes.string,
};
