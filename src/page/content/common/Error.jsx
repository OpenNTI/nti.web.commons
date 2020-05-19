import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import * as Errors from '../../../errors';

import Styles from './Error.css';

const cx = classnames.bind(Styles);

PageError.propTypes = {
	className: PropTypes.string
};
export default function PageError ({className, ...otherProps}) {
	return (
		<section className={cx('error-page', className)}>
			<Errors.Message {...otherProps} />
		</section>
	);
}