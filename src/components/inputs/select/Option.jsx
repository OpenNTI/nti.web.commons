import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class SelectInputOption extends React.Component {
	static propTypes = {
		value: PropTypes.string,
		className: PropTypes.string,
		children: PropTypes.node,

		onClick: PropTypes.func,
		selected: PropTypes.bool
	}


	onClick = () => {
		const {onClick, value} = this.props;

		if (onClick) {
			onClick(value);
		}
	}


	render () {
		const {value, selected, children} = this.props;

		return (
			<div
				role="option"
				className={cx('nti-select-input-option', {selected})}
				data-value={value}
				onClick={this.onClick}
			>
				{children}
			</div>
		);
	}
}
