import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import * as Icons from '../../icons';
import {Card} from '../../standard-ui';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

SingleImageLightbox.propTypes = {
	className: PropTypes.string,
	onDismiss: PropTypes.func,
	children: PropTypes.any
};
export default function SingleImageLightbox ({className, onDismiss, children}) {
	return (
		<article className={cx('single-image-lightbox', className)}>
			<header>
				<a className={cx('close')} onClick={onDismiss} role="button">
					<Icons.X />
				</a>
			</header>
			<section>
				<Card className={cx('lightbox-content')}>
					{children}
				</Card>
			</section>
		</article>
	);
}