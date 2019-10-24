import React from 'react';
import classnames from 'classnames/bind';

import style from './Demos.css';
import Menu from './Menu';
import * as Items from './items';

const cx = classnames.bind(style);

function Choose () {
	return <div className={cx('choose')}>Choose a component</div>;
}

function componentFromHash () {
	const {hash} = global.location;
	return Items[hash.substring(1)] || Choose;
}

export default function Demos () {

	// functions are expected to return state, not be state,
	const [Cmp, setCmp] = React.useState(componentFromHash);
	
	const onHashChange = () => {
		setCmp(componentFromHash);
	};

	React.useEffect(() => {
		global.addEventListener('hashchange', onHashChange);
		return () => global.removeEventListener('hashchange', onHashChange);
	}, []);

	return (
		<div className={cx('demos')}>
			<div className={cx('demo-container')}>
				<Cmp />
			</div>
			<Menu items={Items} selected={(Cmp || {}).displayName} />
		</div>
	);
}
