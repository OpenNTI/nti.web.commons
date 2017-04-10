import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';


DrillUp.propTypes = {
	className: PropTypes.string,
	label: PropTypes.string,
	href: PropTypes.string,
	onClick: PropTypes.func
};

export default function DrillUp (props) {
	const cls = cx('drill-up', props.className);
	return (
		<a {...props} className={cls} label={null}><i className="icon-chevron-left"/>{props.label}</a>
	);
}
