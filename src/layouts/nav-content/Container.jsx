import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Logger from '@nti/util-logger';

import { StickyContainer } from '../../components';

import { Nav } from './Nav';
import { Content } from './Content';

const log = Logger.get('common:layouts:nav-content:container');

Container.propTypes = {
	className: PropTypes.string,
	children: PropTypes.any,
};
export function Container({ className, children, ...otherProps }) {
	const items = React.Children.toArray(children);
	const isSticky = items.some(item => item.type === Nav && item.props.sticky);
	const Cmp = isSticky ? StickyContainer : 'div';

	return (
		<Cmp
			className={cx('nav-content-container', className)}
			{...otherProps}
			css={css`
				display: flex;
				justify-content: space-between;
				max-width: 1024px;
				margin: 0 auto;
			`}
		>
			{items.map(item => {
				if (item.type !== Nav && item.type !== Content) {
					log.warn(
						'Unexpected child passed to NavContent.Container. Dropping it on the floor.'
					);
					return null;
				}

				return item;
			})}
		</Cmp>
	);
}
