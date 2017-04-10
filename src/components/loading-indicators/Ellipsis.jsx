import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';


TinyLoader.propTypes = {
	className: PropTypes.string
};
export default function TinyLoader ({className}) {
	return (
		<ul className={cx('tinyloader', className)}>
			<li /><li /><li />
		</ul>
	);
}
