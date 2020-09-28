import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Events} from '@nti/lib-commons';

import styles from './Button.css';

const cx = classnames.bind(styles);

export default class Button extends React.Component {
	static propTypes = {
		component: PropTypes.any,
		className: PropTypes.string,
		onClick: PropTypes.func,

		rounded: PropTypes.bool,
		disabled: PropTypes.bool,
		secondary: PropTypes.bool,
		destructive: PropTypes.bool,
		plain: PropTypes.bool,
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
			plain,
			...otherProps
		} = this.props;
		const Component = component;
		const cls = cx(
			'nti-button',
			className,
			{
				button: !plain,
				primary: !secondary && !destructive && !plain,
				secondary,
				destructive,
				disabled,
				rounded,
				plain,
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
