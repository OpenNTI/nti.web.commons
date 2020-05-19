import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Text from '../../../text';
import Image from '../../../image';

import Styles from './Styles.css';
import OutlineIcon from './assets/outline.svg';

const cx = classnames.bind(Styles);

function getContents (title, children) {
	try {
		return React.Children.only(children);
	} catch (e) {
		return (
			<div className={cx('outline-text-header')}>
				<Image src={OutlineIcon} aria-hidden="hidden" />
				<Text.Base>{title}</Text.Base>
			</div>
		);
	}
} 

NavigationOutlineHeader.propTypes = {
	className: PropTypes.string,
	title: PropTypes.string,

	as: PropTypes.any,
	children: PropTypes.any
};
export default function NavigationOutlineHeader ({className, title, as: tag, children}) {
	const Cmp = tag || 'div';

	return (
		<Cmp className={cx('outline-header', className)}>
			{getContents(title, children)}
		</Cmp>
	);
}