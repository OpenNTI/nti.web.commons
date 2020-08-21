import './Tab.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class NavigationListTab extends React.Component {
	static propTypes = {
		tab: PropTypes.shape({
			label: PropTypes.string,
			route: PropTypes.string,
			active: PropTypes.bool
		}),
		inMenu: PropTypes.bool,
		renderTab: PropTypes.func,
		alignIndicatorTo: PropTypes.func,
		unalignIndicatorTo: PropTypes.func,
		onDismiss: PropTypes.func
	}

	node = React.createRef()

	componentDidMount () {
		const {tab} = this.props;

		if (tab.active) {
			this.focusTab();
		}
	}

	componentWillUnmount () {
		this.unfocusTab();
	}


	componentDidUpdate (prevProps) {
		const {tab:prevTab} = prevProps;
		const {tab} = this.props;

		if (prevTab.active && !tab.active) {
			this.unfocusTab();
		} else if (!prevTab.active && tab.active) {
			this.focusTab();
		}
	}


	onClick = () => {
		const {onDismiss} = this.props;

		if (onDismiss) {
			onDismiss();
		}
	}


	focusTab () {
		const {alignIndicatorTo} = this.props;

		if (this.node.current && alignIndicatorTo) {
			alignIndicatorTo(this.node.current);
		}
	}


	unfocusTab () {
		const {unalignIndicatorTo} = this.props;

		if (this.node.current && unalignIndicatorTo) {
			unalignIndicatorTo(this.node.current);
		}
	}


	render () {
		const {tab, inMenu, renderTab} = this.props;

		const tabCmp = (
			<div
				className={cx('nti-navigation-list-tab', {active: tab.active, 'in-menu': inMenu})}
				ref={this.node}
				data-text={tab.label}
				onClick={this.onClick}
			>
				{tab.label}
			</div>
		);

		return renderTab ? renderTab(tabCmp, tab) : tabCmp;
	}
}
