import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {Triggered} from '../../../../flyout';
import {isSameTabConfig} from '../../../utils';

import Tab from './Tab';

const InitialState = () => ({settled: false, tabsInMenu: {}, activeOffset: null});
const trigger = React.forwardRef(({className, ...props}, ref) => {
	return (<div className={cx('show-more', className)} ref={ref} {...props}/>);
});

function getParentFor (tab) {
	let node = tab;

	while (node) {
		if (node.matches('.nti-navigation-tabs-list')) {
			return node;
		}

		node = node.offsetParent;
	}

	return null;
}

export default class NavigationTabs extends React.Component {
	static propTypes = {
		tabs: PropTypes.arrayOf(
			PropTypes.shape({
				link: PropTypes.string,
				label: PropTypes.string,
				id: PropTypes.string
			})
		)
	}

	node = React.createRef()
	showMore = React.createRef()

	state = InitialState()

	componentDidMount () {
		this.ntiIsMounted = true;
		this.maybeSettle(this.props);

		global.addEventListener('resize', this.onWindowResize);
	}

	componentWillUnmount () {
		global.removeEventListener('resize', this.onWindowResize);
	}


	componentDidUpdate (prevProps) {
		const {tabs:prevTabs} = prevProps;
		const {tabs} = this.props;

		if (!isSameTabConfig(tabs, prevTabs)) {
			this.setState(InitialState);
		} else {
			this.maybeSettle(this.props);
		}
	}


	onWindowResize = () => {
		if (this.handleWindowResize) { return; }

		this.handleWindowResize = setTimeout(() => {
			const node = this.node.current;

			if (node && node.offsetWidth !== this.settledWidth) {
				this.setState(InitialState);
			}

			delete this.handleWindowResize;
		}, 100);
	}


	maybeSettle (props) {
		const {tabs} = props;
		const node = this.node.current;
		const {settled} = this.state;

		const doSettle = () => {
			this.settledWidth = node.offsetWidth;

			this.setState({
				settled: true
			}, () => {
				setTimeout(() => {
					if (this.realignIndicator) {
						this.realignIndicator();
					}
				}, 800);
			});
		};

		if (!node || !tabs || settled) { return; }
		if (node.scrollWidth <= node.offsetWidth) {
			doSettle();
			return;
		}

		const {tabsInMenu} = this.state;

		let tabToHide = null;

		for (let i = tabs.length - 1; i >= 0; i--) {
			let tab = tabs[i];

			if (!tabsInMenu[tab.id]) {
				tabToHide = tab.id;
				break;
			}
		}

		if (tabToHide === tabs[0].id) {
			doSettle();
		} else if (tabToHide) {
			this.setState({
				settled: false,
				tabsInMenu: {...tabsInMenu, [tabToHide]: true}
			});
		}
	}


	alignIndicatorTo = (tab) => {
		const node = this.node.current || getParentFor(tab);

		if (!node || !tab) { return; }

		this.realignIndicator = () => {

			const thisRect = node.getBoundingClientRect();
			const tabRect = tab.getBoundingClientRect();

			this.focusedTab = tab;

			this.setState({
				activeIndicatorStyles: {
					left: `${tabRect.left - thisRect.left}px`,
					width: `${tabRect.width}px`
				}
			});
		};

		this.realignIndicator();
	}


	unalignIndicatorTo = (tab) => {
		if (this.focusedTab !== tab) { return; }

		delete this.focusedTab;
		this.realignIndicator = () => {};
		this.setState({
			focusedTab: null,
			activeIndicatorStyles: null
		});
	}


	alignIndicatorToShowMore = () => {}


	render () {
		const {tabs} = this.props;
		const {settled} = this.state;

		if (!tabs || !tabs.length) { return null; }

		return (
			<div className={cx('nti-navigation-tabs-list', {settled})} ref={this.node}>
				{this.renderTabs()}
				{this.renderMenu()}
				{this.renderActiveInidicator()}
			</div>
		);
	}


	renderTabs () {
		const {tabs} = this.props;
		const {tabsInMenu} = this.state;

		const visibleTabs = tabs.filter(tab => !tabsInMenu[tab.id]);

		return (
			<ul className="visible-tabs">
				{
					visibleTabs.map((tab, index) => {
						const style = {
							transitionDelay: `${0.3 + (0.1 * index)}s`
						};

						return (
							<li key={tab.id} style={style}>
								<Tab tab={tab} alignIndicatorTo={this.alignIndicatorTo} unalignIndicatorTo={this.unalignIndicatorTo} />
							</li>
						);
					})
				}
			</ul>
		);
	}


	renderMenu () {
		const {tabs} = this.props;
		const {tabsInMenu} = this.state;

		const menuTabs = tabs.filter(tab => tabsInMenu[tab.id]);

		if (!menuTabs.length) { return null; }

		return (
			<Triggered
				trigger={trigger}
				verticalAlign={Triggered.ALIGNMENTS.BOTTOM}
			>
				<ul className="nti-navigation-tabs-menu-tabs">
					{
						menuTabs.map((tab) => {
							return (
								<li key={tab.id}>
									<Tab tab={tab} inMenu/>
								</li>
							);
						})
					}
				</ul>
			</Triggered>
		);
	}


	renderActiveInidicator () {
		const {activeIndicatorStyles} = this.state;

		return (
			<div className={cx('active-indicator', {hidden: !activeIndicatorStyles})} style={activeIndicatorStyles} />
		);
	}
}
