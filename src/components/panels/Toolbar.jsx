import './Toolbar.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

Toolbar.propTypes = { className: PropTypes.string };
export default function Toolbar (props) {
	return (
		<div {...props} className={cx('toolbar-component', props.className)}/>
	);
}


Spacer.propTypes = { className: PropTypes.string };
export function Spacer (props) {
	return <span {...props} className={cx('spacer', props.className)}/>;
}
