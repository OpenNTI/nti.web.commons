import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Styles.css';
import Content from './content';
import Navigation from './navigation';

const cx = classnames.bind(Styles);

const NavigationCls = 'navigation';
const ContentCls = 'content';

Page.Content = Content;
Page.Navigation = Navigation;
Page.propTypes = {
	className: PropTypes.string,
	as: PropTypes.any,
	children: PropTypes.any
};
export default function Page ({className, as: tag, children}) {
	const items = React.Children.toArray(children).reduce((acc, child) => {
		if (Navigation.isNavigation(child)) {
			if (acc.some(c => c.cls === NavigationCls)) {
				throw new Error('Cannot have more than one navigation component in a page');
			}

			acc.push({cls: NavigationCls, cmp: child});
		} else if (Content.isContent(child)) {
			if (acc.some(c => c.cls === ContentCls)) {
				throw new Error('Cannot have more than one content component in a page');
			}

			acc.push({cls: ContentCls, cmp: child});
		} else {
			throw new Error(`Unknown Page component: ${child.type}`);
		}

		return acc;
	}, []);

	
	const layoutCls = items.map(i => i.cls).join('-');
	const content = items.map(i => i.cmp);

	const Cmp = tag || 'article';

	return (
		<Cmp className={cx('nt-page', layoutCls)}>
			{content}
		</Cmp>
	);
}