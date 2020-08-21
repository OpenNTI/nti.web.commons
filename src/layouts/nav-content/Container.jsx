import './Container.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Logger from '@nti/util-logger';

import {StickyContainer} from '../../components';

import Nav from './Nav';
import Content from './Content';

const log = Logger.get('common:layouts:nav-content:container');

NavContentContainer.propTypes = {
	className: PropTypes.string,
	children: PropTypes.any
};
export default function NavContentContainer ({className, children, ...otherProps}) {
	const items = React.Children.toArray(children);
	const isSticky = items.some(item => item.type === Nav && item.props.sticky);
	const Cmp = isSticky ? StickyContainer : 'div';

	return (
		<Cmp className={cx('nav-content-container', className)} {...otherProps}>
			{items.map((item) => {
				if (item.type !== Nav && item.type !== Content) {
					log.warn('Unexpected child passed to NavContent.Container. Dropping it on the floor.');
					return null;
				}

				return item;
			})}
		</Cmp>
	);
}
