import React from 'react';
import cx from 'classnames';

Toolbar.propTypes = { className: React.PropTypes.string };
export default function Toolbar (props) {
	return (
		<div {...props} className={cx('toolbar-component', props.className)}/>
	);
}


Spacer.propTypes = { className: React.PropTypes.string };
export function Spacer (props) {
	return <span {...props} className={cx('spacer', props.className)}/>;
}
