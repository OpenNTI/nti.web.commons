import React from 'react';
import classnames from 'classnames/bind';

import {Toggle} from '../../../../src/components/inputs';

import Sun from './SunIcon';
import Moon from './MoonIcon';
import style from './Toggle.css';

const cx = classnames.bind(style);

const classes = {
	root: cx('root'),
	toggler: cx('toggler'),
	label: cx('label'),
	button: cx('button'),
	icon: cx('icon'),
	icons: cx('icons'),
	iconOff: cx('icon-off'),
	iconOn: cx('icon-on')
};

export default function ToggleInput (props) {
	const [checked, setChecked] = React.useState();
	return (
		<>
			<Toggle
				classes={classes}
				iconOff={Moon}
				iconOn={Sun}
				hideLabel
				className={cx('theme-toggle', { off: !checked, on: checked})}
				value={checked}
				onChange={setChecked}
			/>
			<Toggle
				hideLabel
				value={checked}
				onChange={setChecked}
			/>
		</>
	);
}
