import React from 'react';
import cx from 'classnames';

const DEFAULT_MESSAGE = 'Unknown Error';

export default class ErrorView extends React.Component {
	static propTypes = {
		error: React.PropTypes.object.isRequired,
		isWarning: React.PropTypes.bool,
		onFocus: React.PropTypes.func
	}

	setErrorCmpRef = x => this.errorCmp = x

	componentWillReceiveProps (nextProps) {
		const {error: newError} = nextProps;
		const {error: oldError} = this.props;

		if (newError !== oldError) {
			this.addListener(newError);
		}
	}


	componentDidMount () {
		this.addListener();
	}


	componentWillUnmount () {
		this.removeListener();
	}


	addListener (newError) {
		this.removeListener();

		const {error} = this.props;
		const listenTo = newError || error;

		if (listenTo) {
			listenTo.addListener('focus', this.doFocus);
		}
	}


	removeListener () {
		const {error} = this.props;

		if (error) {
			error.removeListener('focus', this.doFocus);
		}
	}


	doFocus = () => {
		const {onFocus} = this.props;

		if (onFocus) {
			onFocus();
		} else if (this.errorCmp) {
			this.errorCmp.focus();
		}
	}


	render () {
		const {error, isWarning} = this.props;
		const cls = cx('nti-error', {warning: isWarning});
		const msg = error.message || DEFAULT_MESSAGE;

		return (
			<div ref={this.setErrorCmpRef} className={cls}>{msg}</div>
		);
	}
}
