import './Error.scss';
import React from 'react';
import PropTypes from 'prop-types';

import Logger from '@nti/util-logger';
import { rawContent } from '@nti/lib-commons';
import { reportError } from '@nti/web-client';

const logger = Logger.get('common:components:Error');

const isHTML = /<html|<([a-z]+)[^>]*>(.+)<\/\1>/i;

export default class Error extends React.Component {
	static propTypes = {
		message: PropTypes.string,
		error: PropTypes.any.isRequired,
	};

	componentDidMount() {
		this.log();
	}

	componentDidUpdate(props) {
		if (this.props.error !== props.error) {
			this.log(this.props);
		}
	}

	log = (props = this.props) => {
		let { error } = props;
		if (reportError(error) === false) {
			logger.error(
				error?.stack ||
					error?.message ||
					error?.responseText ||
					error ||
					props
			);
		} else {
			logger.error('Error reported.');
		}
	};

	isAccessError = (props = this.props) => {
		let { error } = props;
		if (error?.statusCode != null) {
			let code = parseInt(error.statusCode, 10); //just a precaution, should already be an int.
			return code > 400 && code < 404;
		}

		return false;
	};

	isNotFound = (props = this.props) => {
		let { error } = props;
		if (error?.statusCode != null) {
			let code = parseInt(error.statusCode, 10); //just a precaution, should already be an int.
			return code === 404;
		}

		return false;
	};

	render() {
		let { error, message } = this.props;
		let label = 'Error';
		if (!message) {
			message =
				(typeof error !== 'string' ? '' : error) ||
				'Something went wrong.';
		}

		if (isHTML.test(message)) {
			message = <pre {...rawContent(message)} />;
		}

		if (this.isAccessError()) {
			label = 'Access was denied.';
			message =
				"We're sorry, but you do not have access to this content.";
		} else if (this.isNotFound()) {
			label = 'Not Found.';
			message = "We're sorry, but we could not find this content.";
		}

		return (
			<figure className="error">
				<div className="m glyph icon-alert" />
				<figcaption>
					<span>{label}</span>
					<div>{message}</div>
				</figcaption>
			</figure>
		);
	}
}
