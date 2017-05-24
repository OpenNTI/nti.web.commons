import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {getRefHandler} from 'nti-commons';


export default class Label extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		label: PropTypes.string,

		children: PropTypes.element
	}

	attachInputRef = x => this.input = x;

	get validity () {
		return this.input && this.input.validity;
	}


	focus () {
		if (this.input && this.input.focus) {
			this.input.focus();
		}
	}


	render () {
		const {className, label, ...otherProps} = this.props;
		const {validity} = this;
		const cls = cx('nti-labeled-input', className, {valid: !validity || validity.valid, invalid: validity && !validity.valid});

		delete otherProps.onChange;

		return (
			<label className={cls} {...otherProps} >
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
