import './Ellipsis.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';


TinyLoader.propTypes = {
	className: PropTypes.string,
	mask: PropTypes.bool
};
export default function TinyLoader ({className, mask}) {
	return (
		<ul className={cx('tinyloader', {'with-mask': mask}, className)}>
			<li /><li /><li />
		</ul>
	);
}
