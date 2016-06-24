import React from 'react';
import cx from 'classnames';


DrillUp.propTypes = {
	className: React.PropTypes.string,
	label: React.PropTypes.string,
	href: React.PropTypes.string,
	onClick: React.PropTypes.func
};

export default function DrillUp (props) {
	const cls = cx('drill-up', props.className);
	return (
		<a {...props} className={cls} label={null}><i className="icon-chevron-left"/>{props.label}</a>
	);
}
