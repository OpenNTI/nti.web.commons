import React from 'react';
import cx from 'classnames';


TinyLoader.propTypes = {
	className: React.PropTypes.string
};
export default function TinyLoader ({className}) {
	return (
		<ul className={cx('tinyloader', className)}>
			<li /><li /><li />
		</ul>
	);
}
