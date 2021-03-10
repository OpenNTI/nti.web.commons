import React from 'react';
import PropTypes from 'prop-types';

import { restProps } from '@nti/lib-commons';

import { ForwardRef } from '../../decorators';

class FocusVisible extends React.Component {
	static propTypes = {
		as: PropTypes.any,

		onFocusVisible: PropTypes.func,
		onFocus: PropTypes.func,
		onBlur: PropTypes.func,
		onMouseDown: PropTypes.func,
		onMouseUp: PropTypes.func,

		forwardedRef: PropTypes.func,
	};

	onFocus = (...args) => {
		const { onFocus, onFocusVisible } = this.props;

		if (onFocusVisible && !this.mousedown && !this.focused) {
			onFocusVisible();
		}
		if (onFocus) {
			onFocus(...args);
		}

		this.focused = true;
	};

	onMouseDown = (...args) => {
		const { onMouseDown } = this.props;

		this.mousedown = true;

		if (onMouseDown) {
			onMouseDown(...args);
		}
	};

	onMouseUp = (...args) => {
		const { onMouseUp } = this.props;

		this.mousedown = false;

		if (onMouseUp) {
			onMouseUp(...args);
		}
	};

	onBlur = (...args) => {
		const { onBlur } = this.props;

		this.focused = false;

		if (onBlur) {
			onBlur(...args);
		}
	};

	render() {
		const { as: tag, forwardedRef } = this.props;
		const otherProps = restProps(FocusVisible, this.props);
		const Cmp = tag || 'div';

		return (
			<Cmp
				{...otherProps}
				onMouseDown={this.onMouseDown}
				onMouseUp={this.onMouseUp}
				onFocus={this.onFocus}
				onBlur={this.onBlur}
				ref={forwardedRef}
			/>
		);
	}
}

export default ForwardRef()(FocusVisible);
