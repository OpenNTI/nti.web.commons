import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import {LockScroll} from '../../../../components';

import Trigger from './Trigger';
import Tab from './Tab';

const defaultTop = '2.8125rem';
const transitionTimeout = 350;
const menuOpenBodyClass = 'nav-menu-open';

export default class NavigationTabsMenuView extends React.Component {
	static propTypes = {
		tabs: PropTypes.arrayOf(
			PropTypes.shape({
				route: PropTypes.string,
				label: PropTypes.string,
				id: PropTypes.string,
				active: PropTypes.bool
			})
		),
		renderTab: PropTypes.func
	}

	state = {open: false, top: defaultTop}

	toggleMenu = (e) => {
		e.preventDefault();
		e.stopPropagation();

		const {open} = this.state;

		this.updateBodyClass(!open);
		this.setState({open: !open});
	}


	updateBodyClass (open) {
		// video elements interfere with the menu interaction. adding a class to body
		// when the menu is open allows us to use css to get the videos out of the way.
		if (open) {
			document.body.classList.add(menuOpenBodyClass);
		} else {
			document.body.classList.remove(menuOpenBodyClass);
		}
	}


	alignMenuTo = (node) => {
		this.setState({
			top: node ? `${node.getBoundingClientRect().bottom}px` : defaultTop
		});
	}


	render () {
		const {tabs} = this.props;
		const {open} = this.state;

		if (!tabs || !tabs.length) { return null; }

		const activeTab = tabs.find(tab => tab.active);

		return (
			<div className="nti-navigation-tabs-menu">
				<Trigger
					tab={activeTab}
					open={open}
					hasMore={tabs.length > 1}
					toggleMenu={this.toggleMenu}
					alignMenuTo={this.alignMenuTo}
				/>
				<TransitionGroup>
					{open && (<LockScroll />)}
					{open && (
						<CSSTransition key="mask" classNames="navigation-mask" timeout={transitionTimeout}>
							{this.renderMask()}
						</CSSTransition>
					)}
					{open && (
						<CSSTransition key="menu" classNames="navigation-menu" timeout={transitionTimeout}>
							{this.renderMenu()}
						</CSSTransition>
					)}
				</TransitionGroup>
			</div>
		);
	}


	renderMenu () {
		const {top} = this.state;
		const {tabs, renderTab} = this.props;

		return (
			<div className="menu" style={{top}}>
				<ul>
					{tabs.map((tab) => {
						return (
							<li key={tab.id}>
								<Tab tab={tab} renderTab={renderTab} />
							</li>
						);
					})}
				</ul>
			</div>
		);
	}


	renderMask () {
		const {top} = this.state;

		return (
			<a href="#" className="menu-mask" onClick={this.toggleMenu} style={{top}} />
		);
	}
}
