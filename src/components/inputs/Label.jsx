import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/dedupe';
import {getRefHandler} from '@nti/lib-commons';

import Text from '../../text';
import {Message as ErrorMessage} from '../../errors';


export default class Label extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		label: PropTypes.string,
		error: PropTypes.any,

		children: PropTypes.element
	}

	attachInputRef = x => this.input = x;

	state = {}

	get validity () {
		return this.input && this.input.validity;
	}


	focus () {
		if (this.input && this.input.focus) {
			this.input.focus();
		}
	}


	onInputOrFormValidation = () => {
		// we specifically can't use state here because it will cause select onChange events to emit stale data due
		// to the re-render.  Instead, we're just setting interacted as an instance variable, though there is a known
		// edge case where the label component isn't redrawn due to changes in the input, in which case, this will not
		// set the valid/invalid classname on the label element.  Locally testing though, this works in the general case
		this.interacted = true;
	}


	render () {
		const {
			validity,
			props: {
				className,
				label,
				error,
				...otherProps
			},
			interacted
		} = this;

		const cls = cx(
			'nti-labeled-input',
			className,
			{error},
			interacted && {
				valid: !validity || validity.valid,
				invalid: validity && !validity.valid
			}
		);

		delete otherProps.onChange;

		return (
			<label {...otherProps} className={cls} onInput={this.onInputOrFormValidation} onInvalid={this.onInputOrFormValidation}>
				<Text.Base className="label">{label}</Text.Base>
				{this.renderInput()}
				{error && (
					<ErrorMessage error={error} className="nti-label-error" />
				)}
			</label>
		);
	}


	renderInput = () => {
		const {children} = this.props;
		const child = React.Children.only(children);

		return React.cloneElement(child, {ref: getRefHandler(child.ref, this.attachInputRef)});
	}
}
