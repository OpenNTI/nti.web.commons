import './Error.scss';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Logger from '@nti/util-logger';
import { rawContent } from '@nti/lib-commons';
import { reportError } from '@nti/web-client';

const logger = Logger.get('common:components:Error');

const isHTML = /<html|<([a-z]+)[^>]*>(.+)<\/\1>/i;

const Message = styled.figcaption`
	line-height: 1em;
	color: #757575;
	font-size: 1em;
	text-align: center;

	& > div {
		white-space: pre;
		word-wrap: break-word;
		word-break: break-word;
	}
`;

const Label = styled.span`
	display: inline-block;
	color: #b22222;
	font-weight: bold;
	font-size: 1em;
	margin-bottom: 1em;
`;

const Glyph = styled('div').attrs({ className: 'm glyph icon-alert' })`
	color: #b33333;
	font-size: 5em;
	width: 5em;
	text-align: center;

	/* .m */
	margin: 0 auto;
	position: relative;
`;

const Figure = styled('figure').attrs({ className: 'error' })`
	overflow: visible;
	position: relative;

	&.inline {
		margin: 0;
		display: flex;
		flex-direction: row;
		align-items: center;

		${Glyph} {
			flex: 0 0 auto;
			font-size: 2em;
			margin: 0 0.25em 0 0;
			width: auto;
		}

		${Label}, ${Message} > div {
			display: inline;
		}

		${Label} {
			margin-bottom: 0;
			&::after {
				content: ': ';
			}
		}

		${Message} {
			flex: 1 1 auto;
			text-align: left;
			font-size: 1em;
		}
	}
`;

Error.propTypes = {
	inline: PropTypes.bool,
	message: PropTypes.string,
	error: PropTypes.any.isRequired,
};

export default function Error(props) {
	let { inline = false, error, children, message = children } = props;

	useEffect(() => {
		report(error);
	}, [error]);

	let label = 'Error';
	if (!message) {
		message =
			(typeof error !== 'string' ? '' : error) || 'Something went wrong.';
	}

	if (isHTML.test(message)) {
		message = <pre {...rawContent(message)} />;
	}

	if (isAccessError(props)) {
		label = 'Access was denied.';
		message = "We're sorry, but you do not have access to this content.";
	} else if (isNotFound(props)) {
		label = 'Not Found.';
		message = "We're sorry, but we could not find this content.";
	}

	return (
		<Figure inline={inline}>
			<Glyph />
			<Message>
				<Label>{label}</Label>
				<div>{message}</div>
			</Message>
		</Figure>
	);
}

function report(error) {
	if (!error) {
		return;
	}
	if (reportError(error) === false) {
		logger.error(
			error.stack || error.message || error.responseText || error
		);
	} else {
		logger.error('Error reported.');
	}
}

function isAccessError(props) {
	const { error } = props;
	if (error?.statusCode != null) {
		const code = parseInt(error.statusCode, 10); //just a precaution, should already be an int.
		return code > 400 && code < 404;
	}

	return false;
}

function isNotFound(props) {
	const { error } = props;
	if (error?.statusCode != null) {
		const code = parseInt(error.statusCode, 10); //just a precaution, should already be an int.
		return code === 404;
	}

	return false;
}
