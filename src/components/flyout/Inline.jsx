import React from 'react';
import cx from 'classnames';

export default class InlineFlyout extends React.Component {
	static propTypes = {
		trigger: React.PropTypes.node,
		children: React.PropTypes.any
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
		const {open} = this.state;
		const cls = cx('inner-flyout', {open});

		return (
			<div className="inline-flyout" onClick={this.toggle}>
				{trigger}
				<div className={cls} ref={this.setInnerRef}>
					{open && children}
				</div>
			</div>
		);
	}
}
