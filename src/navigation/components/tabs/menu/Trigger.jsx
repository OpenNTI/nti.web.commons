import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

const t = scoped('common.navigation.compnents.tabs.menu.Trigger', {
	defaultLabel: 'Tabs'
});


export default class NavigationTab extends React.Component {
	static propTypes = {
		tab: PropTypes.shape({
			label: PropTypes.string.isRequired
		}),

		open: PropTypes.bool,
		hasMore: PropTypes.bool,

		toggleMenu: PropTypes.func,
		alignMenuTo: PropTypes.func
	}

	attachRef = (node) => {
		const {alignMenuTo} = this.props;

		if (alignMenuTo) {
			alignMenuTo(node);
		}
	}

	onClick = (e) => {
		const {toggleMenu, hasMore} = this.props;

		if (toggleMenu, hasMore) {
			toggleMenu(e);
		}
	}

	render () {
		const {tab, open, hasMore} = this.props;
		const label = tab ? tab.label : t('defaultLabel');

		return (
			<div className={cx('nti-navigation-tabs-menu-trigger', {open})} onClick={this.onClick} ref={this.attachRef}>
				<span className="label">{label}</span>
				{hasMore && (<i className="icon-chevron-down" />)}
			</div>
		);
	}
}
