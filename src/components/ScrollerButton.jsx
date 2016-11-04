import React from 'react';
import cx from 'classnames';
export default class ScrollerButton extends React.Component {

	static propTypes = {
		className: React.PropTypes.string,
		children: React.PropTypes.any,
		amount: React.PropTypes.number.isRequired,
		onClick: React.PropTypes.func.isRequired,
		disabled: React.PropTypes.bool
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
