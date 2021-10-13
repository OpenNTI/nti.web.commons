import { useEffect, useState } from 'react';
import classnames from 'classnames/bind';

import style from './Demos.css';
import Menu from './Menu';
import * as Items from './items';

const cx = classnames.bind(style);

function Choose() {
	return <div className={cx('choose')}>Choose a component</div>;
}

const nameFromHash = () => global.location.hash.substr(1);
const componentFromHash = () => Items[nameFromHash()] || Choose;

export default function Demos() {
	// functions are expected to return state, not be state,
	const [Cmp, setCmp] = useState(componentFromHash);

	const onHashChange = () => {
		setCmp(componentFromHash);
	};

	useEffect(() => {
		global.addEventListener('hashchange', onHashChange);
		return () => global.removeEventListener('hashchange', onHashChange);
	}, []);

	return (
		<div className={cx('demos')}>
			<div className={cx('demo-container')}>
				<p>These need to be converted to use storybook stories.</p>
				<Cmp />
			</div>
			<Menu items={Items} selected={nameFromHash()} />
		</div>
	);
}
