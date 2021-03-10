import './Trigger.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { scoped } from '@nti/lib-locale';

const t = scoped('common.navigation.compnents.tabs.menu.Trigger', {
	defaultLabel: 'Tabs',
});

export default class NavigationMenuTrigger extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		tab: PropTypes.shape({
			label: PropTypes.string.isRequired,
		}),
		onClick: PropTypes.func,
		hasMore: PropTypes.bool,
	};

	node = React.createRef();

	getDOMNode() {
		return this.node.current;
	}

	onClick = e => {
		const { onClick } = this.props;

		if (onClick) {
			onClick(e);
		}
	};

	render() {
		const { tab, className, hasMore } = this.props;
		const label = tab ? tab.label : t('defaultLabel');

		return (
			<div
				className={cx('nti-navigation-tabs-menu-trigger', className)}
				onClick={this.onClick}
				ref={this.node}
			>
				<span className="trigger-label">{label}</span>
				{hasMore && <i className="icon-chevron-down" />}
			</div>
		);
	}
}
