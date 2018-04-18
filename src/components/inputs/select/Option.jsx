import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class SelectInputOption extends React.Component {
	static propTypes = {
		value: PropTypes.string,
		className: PropTypes.string,
		children: PropTypes.node,
		matches: PropTypes.func,

		onClick: PropTypes.func,
		selected: PropTypes.bool,
		focused: PropTypes.bool,
		display: PropTypes.bool
	}


	onClick = () => {
		const {onClick, value, display} = this.props;

		if (onClick && !display) {
			onClick(value);
		}
	}


	render () {
		const {value, selected, focused, display, children} = this.props;

		return (
			<div
				role="option"
				className={cx('nti-select-input-option', {selected, focused, display})}
				data-value={value}
				onClick={this.onClick}
			>
				{children}
			</div>
		);
	}
}
