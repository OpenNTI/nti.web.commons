import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {LockScroll, FillToBottom} from '../../../../components';

const menuOpenBodyClass = 'nav-menu-open';

export default class NavigationMenu extends React.Component {
	static propTypes = {
		tabs: PropTypes.arrayOf(
			PropTypes.shape({
				label: PropTypes.string,
				active: PropTypes.bool
			})
		),
		renderTab: PropTypes.func,
		onDismiss: PropTypes.func
	}


	componentDidMount () {
		if (typeof document !== 'undefined') {
			document.body.classList.add(menuOpenBodyClass);
		}
	}


	componentWillUnmount () {
		if (typeof document !== 'undefined') {
			document.body.classList.remove(menuOpenBodyClass);
		}
	}


	dismissMenu = () => {
		const {onDismiss} = this.props;

		if (onDismiss) {
			onDismiss();
		}
	}


	render () {
		const {tabs} = this.props;

		return (
			<FillToBottom className="nti-navigation-tabs-menu">
				<LockScroll />
				<div className="mask" onClick={this.dismissMenu}/>
				<ul>
					{tabs.map((tab) => {
						return (
							<li key={tab.id} onClick={this.dismissMenu}>
								{this.renderTab(tab)}
							</li>
						);
					})}
				</ul>
			</FillToBottom>
		);
	}


	renderTab (tab) {
		const {renderTab} = this.props;

		const tabCmp = (
			<div
				className={cx('nti-navigation-menu-tab', {active: tab.active})}
				data-text={tab.label}
			>
				{tab.label}
			</div>
		);

		return renderTab ? renderTab(tabCmp, tab) : tabCmp;
	}
}
