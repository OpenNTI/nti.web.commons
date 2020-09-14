import './Button.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Events} from '@nti/lib-commons';

export default class Button extends React.Component {
	static propTypes = {
		component: PropTypes.any,
		className: PropTypes.string,
		onClick: PropTypes.func,

		rounded: PropTypes.bool,
		disabled: PropTypes.bool,
		secondary: PropTypes.bool,
		destructive: PropTypes.bool
	}


	handleTrigger = (e) => {
		const {disabled, onClick} = this.props;

		// This handler is called for clicks, and keyDown.
		// This filter only allows "clicks" from physical clicks and "keyDown" events from Space or Enter.
		if (disabled || !Events.isActionable(e)) {
			if (disabled) {
				e.preventDefault();
				e.stopPropagation();
			}
			return false;
		}

		if (onClick) {
			onClick(e);
		}
	}


	render () {
		const {
			component = 'a',
			className,
			rounded,
			disabled,
			secondary,
			destructive,
			...otherProps
		} = this.props;
		const Component = component;
		const cls = cx(
			'nti-button',
			className,
			{
				primary: !secondary && !destructive,
				secondary,
				destructive,
				disabled,
				rounded
			}
		);

		delete otherProps.onClick;

		return (
			<Component
				role="button"
				tabIndex="0"
				className={cls}
				onKeyDown={this.handleTrigger}
				onClick={this.handleTrigger}
				{...otherProps}
			/>
		);
	}
}
