import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const DEFAULT_MESSAGE = 'Unknown Error';

export default class ErrorView extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		error: PropTypes.object.isRequired,
		isWarning: PropTypes.bool,
		onFocus: PropTypes.func
	}

	setErrorCmpRef = x => this.errorCmp = x

	componentDidUpdate (prevProps) {
		const {error: newError} = this.props;
		const {error: oldError} = prevProps;

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
		const {error, isWarning, className} = this.props;
		const cls = cx('nti-error', className, {warning: isWarning});
		const msg = error.message || DEFAULT_MESSAGE;

		if (error.doNotShow) {
			return null;
		}

		return (
			<div ref={this.setErrorCmpRef} className={cls}>{msg}</div>
		);
	}
}
