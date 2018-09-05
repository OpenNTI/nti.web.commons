import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class NavigationTab extends React.Component {
	static propTypes = {
		tab: PropTypes.shape({
			label: PropTypes.string,
			route: PropTypes.string,
			active: PropTypes.bool
		}),
		inMenu: PropTypes.bool,
		alignIndicatorTo: PropTypes.func,
		unalignIndicatorTo: PropTypes.func
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
		const {tab, inMenu} = this.props;

		return (
			<div
				className={cx('nti-navigation-list-tab', {active: tab.active, 'in-menu': inMenu})}
				ref={this.node}
				data-text={tab.label}
			>
				{tab.label}
			</div>
		);
	}
}
