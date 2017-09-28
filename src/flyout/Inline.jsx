import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class InlineFlyout extends React.Component {
	static propTypes = {
		trigger: PropTypes.node,
		children: PropTypes.any
	}


	setInnerRef = x => this.innerWrapper = x

	constructor (props) {
		super(props);

		this.state = {
			open: false
		};
	}


	componentWillUnmount () {
		this.removeBodyListeners();
	}


	addBodyListeners () {
		this.removeBodyListeners();
		window.document.addEventListener('click', this.maybeDismiss);
	}


	removeBodyListeners () {
		window.document.removeEventListener('click', this.maybeDismiss);
	}


	maybeDismiss = (e) => {
		if (this.innerWrapper && !this.innerWrapper.contains(e.target)) {
			this.dismiss();
		}
	}


	dismiss () {
		this.removeBodyListeners();
		this.setState({
			open: false
		});
	}


	toggle = () => {
		const {open} = this.state;
		const shouldOpen = !open;

		if (shouldOpen) {
			this.addBodyListeners();
		} else {
			this.removeBodyListeners();
		}

		this.setState({
			open: !open
		});
	}


	render () {
		const {trigger, children} = this.props;
		const content = React.Children.only(children);
		const c = React.cloneElement(content, {onDismiss: this.close});
		const t = React.cloneElement(trigger, {onClick: this.toggle});
		const {open} = this.state;
		const cls = cx('inner-flyout', {open});

		return (
			<div className="inline-flyout" onClick={this.toggle}>
				{t}
				<div className={cls} ref={this.setInnerRef}>
					{open && c}
				</div>
			</div>
		);
	}
}
