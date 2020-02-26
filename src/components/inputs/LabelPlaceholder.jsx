import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Text from '../../text';
import {Message as ErrorMessage} from '../../errors';

import Styles from './LabelPlaceholder.css';

const cx = classnames.bind(Styles);

const Box = cx('box');
const Underlined = cx('underlined');

let seenIds = 0;

const getId = () => {
	seenIds += 1;

	return `nti-${seenIds}`;
};

LabelPlaceholder.Box = Box;
LabelPlaceholder.Underlined = Underlined;
LabelPlaceholder.propTypes = {
	className: PropTypes.string,
	label: PropTypes.string,
	error: PropTypes.any,

	locked: PropTypes.bool,
	center: PropTypes.bool,
	noError: PropTypes.bool,
	fill: PropTypes.bool,

	variant: PropTypes.oneOf([Box, Underlined]),
	as: PropTypes.string,

	children: PropTypes.element
};

export default function LabelPlaceholder ({className, variant = Box, as:tag, label, error, locked, center, noError, fill, children, ...otherProps}) {
	const [id] = React.useState(() => getId());
	const errorId = `${id}-error`;
	const input = React.Children.only(children);
	const Cmp = tag || 'div';

	return (
		<Cmp className={cx('nti-label-placeholder', className, variant, {error, locked, center, fill})} data-input-id={id} {...otherProps} >
			<div className={cx('input-wrapper')}>
				{React.cloneElement(input, {id, placeholder: input.props.placeholder || ' ', 'aria-describedby': errorId})}
				{label && (
					<Text.Base as="label" className={cx('label-placeholder')} htmlFor={id}>{label}</Text.Base>
				)}
				{variant === Box && label && (
					<fieldset className={cx('fieldset')}>
						<legend className={cx('legend')}>{label}</legend>
					</fieldset>
				)}
			</div>
			{!noError && (<ErrorMessage error={error} className={cx('error-message')} id={errorId} role="alert" />)}
		</Cmp>
	);
}
