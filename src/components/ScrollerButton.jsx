import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
export default class ScrollerButton extends React.Component {

	static propTypes = {
		className: PropTypes.string,
		children: PropTypes.any,
		amount: PropTypes.number.isRequired,
		onClick: PropTypes.func.isRequired,
		disabled: PropTypes.bool
	}

	handleClick = () => {
		const {amount, onClick} = this.props;
		onClick(amount);
	}

	render () {

		const {className, disabled} = this.props;

		return (
			<button onClick={this.handleClick} className={cx('scroll-button', className, {disabled})}>{this.props.children}</button>
		);
	}
}
