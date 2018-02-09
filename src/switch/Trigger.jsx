import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';


export default class SwitchTrigger extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		item: PropTypes.string,
		onClick: PropTypes.func,
		children: PropTypes.node,
		action: PropTypes.func
	}

	static contextTypes = {
		switchContext: PropTypes.shape({
			setActiveItem: PropTypes.func,
			activeItem: PropTypes.string,
			availableItems: PropTypes.object
		})
	}

	get switchContext () {
		return this.context.switchContext || {};
	}


	get active () {
		const {item} = this.props;
		const {activeItem} = this.switchContext;

		return activeItem === item;
	}


	get disabled () {
		const {item} = this.props;
		const {availableItems} = this.switchContext;

		return !availableItems || !availableItems[item];
	}


	onClick = (e) => {
		const {item, onClick, action} = this.props;
		const {setActiveItem} = this.switchContext;
		const done = () => {
			if (setActiveItem && !this.disabled) {
				setActiveItem(item);
			}
		};

		if (action) {
			action(done);
		} else {
			done();
		}


		if (onClick) {
			onClick(e);
		}
	}



	render () {
		const {active, disabled} = this;
		const {className, children, ...otherProps} = this.props;

		delete otherProps.item;
		delete otherProps.action;

		return (
			<div {...otherProps} className={cx(className, {active, disabled})} onClick={this.onClick} >
				{children}
			</div>
		);
	}
}
