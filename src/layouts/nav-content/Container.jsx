import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Logger from 'nti-util-logger';

import Nav from './Nav';
import Content from './Content';

const log = Logger.get('web:common:layouts:nav-content:container');

NavContentContainer.propTypes = {
	className: PropTypes.string,
	children: PropTypes.any
};
export default function NavContentContainer ({className, children, ...otherProps}) {
	const items = React.Children.toArray(children);

	return (
		<div className={cx('nav-content-container', className)} {...otherProps}>
			{items.map((item) => {
				if (item.type !== Nav && item.type !== Content) {
					log.warn('Unexpected child passed to NavContent.Container. Dropping it on the floor.');
					return null;
				}

				return item;
			})}
		</div>
	);
}
