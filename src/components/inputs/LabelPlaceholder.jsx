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

	style: PropTypes.oneOf([Box, Underlined]),
	as: PropTypes.string,

	children: PropTypes.element
};
export default function LabelPlaceholder ({className, style = Box, as:tag, label, error, children, ...otherProps}) {
	const id = React.useRef(() => getId());
	const input = React.Children.only(children);
	const Cmp = tag || 'div';

	return (
		<Cmp className={cx('nti-label-placeholder', className, style, {error})} data-input-id={id}>
			{React.cloneElement(input, {id, placeholder: input.props.placeholder || ' '})}
			{label && (
				<Text.Base as="label" className={cx('label-placeholder')} for={id}>{label}</Text.Base>
			)}
			{error && (
				<ErrorMessage error={error} className={cx('error')} />
			)}
		</Cmp>
	);
}