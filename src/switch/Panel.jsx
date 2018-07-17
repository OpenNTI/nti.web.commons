import React from 'react';
import PropTypes from 'prop-types';
import Logger from '@nti/util-logger';

import {getAvailableItems, resolveKey} from './utils';
import Container from './Container';
import Controls from './Controls';

const log = Logger.get('common:switch:Panel');

export default class SwitchPanel extends React.Component {
	static propTypes = {
		children: PropTypes.any,
		active: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
	}


	static childContextTypes = {
		switchContext: PropTypes.shape({
			activeItem: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			hasItem: PropTypes.func,
			setActiveItem: PropTypes.func
		})
	}


	constructor (props) {
		super(props);

		const {active} = props;

		this.state = {
			active
		};
	}


	get container () {
		const {children:childrenProp} = this.props;
		const children = React.Children.toArray(childrenProp);

		for (let child of children) {
			if (child.type === Container) {
				return child;
			}
		}

		return null;
	}


	get items () {
		const  {container} = this;

		return container ? Container.getItems(container) : [];
	}


	getChildContext () {
		return {
			switchContext: {
				availableItems: this.getAvailableItems(),
				activeItem: this.getActiveItem(),
				setActiveItem: (key) => this.setActiveItem(key)
			}
		};
	}


	componentDidUpdate (prevProps) {
		const {active:prevActive} = prevProps;
		const {active:nextActive} = this.props;

		if (prevActive !== nextActive) {
			this.setState({
				active: nextActive
			});
		}
	}


	getAvailableItems () {
		const {items} = this;
		const active = this.getActiveItem();

		return getAvailableItems(items, active);
	}


	getActiveItem () {
		const {active} = this.state;

		return active;
	}



	setActiveItem (key) {
		const active = resolveKey(this.items, this.getActiveItem(), key);

		this.setState({
			active
		});
	}


	render () {
		const {children, ...otherProps} = this.props;
		const {active} = this.state;
		const items = React.Children.toArray(children);

		delete otherProps.active;

		return (
			<div {...otherProps}>
				{
					items.map((child) => {
						if (child.type === Controls) {
							return child;
						}

						if (child.type === Container) {
							return React.cloneElement(child, {active});
						}

						log.warn('Unexpected child type given to Switcher.Panel. Dropping it on the floor');
					})
				}
			</div>
		);
	}
}
