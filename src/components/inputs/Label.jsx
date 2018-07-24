import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/dedupe';
import {getRefHandler} from '@nti/lib-commons';


export default class Label extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		label: PropTypes.string,

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
		this.setState({interacted: true});
	}


	render () {
		const {
			validity,
			props: {
				className,
				label,
				...otherProps
			},
			state: {
				interacted
			}
		} = this;

		const cls = cx('nti-labeled-input', className, interacted && {
			valid: !validity || validity.valid,
			invalid: validity && !validity.valid
		});

		delete otherProps.onChange;

		return (
			<label {...otherProps} className={cls} onInput={this.onInputOrFormValidation} onInvalid={this.onInputOrFormValidation}>
				<span className="label">{label}</span>
				{this.renderInput()}
			</label>
		);
	}


	renderInput = () => {
		const {children} = this.props;
		const child = React.Children.only(children);

		return React.cloneElement(child, {ref: getRefHandler(child.ref, this.attachInputRef)});
	}
}
