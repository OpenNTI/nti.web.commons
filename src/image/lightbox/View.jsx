import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import {Triggered} from '../../prompts';

import Styles from './Styles.css';
import Single from './Single';
import Multiple from './Multiple';

const cx = classnames.bind(Styles);

ImageLightbox.propTypes = {
	trigger: PropTypes.any,
	children: PropTypes.any
};
export default function ImageLightbox ({trigger, children, ...otherProps}) {
	const Cmp = React.Children.count(children) > 1 ? Multiple : Single;

	return (
		<Triggered trigger={trigger} className={cx('lightbox-dialog', 'nti-lightbox-dialog')}>
			<Cmp {...otherProps}>
				{children}
			</Cmp>
		</Triggered>
	);
}
