import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { Loading } from '../../../components';

import Styles from './Loading.css';

const cx = classnames.bind(Styles);

LoadingPage.propTypes = {
	className: PropTypes.string,
};
export default function LoadingPage({ className }) {
	return (
		<section className={cx('loading-page', className)}>
			<Loading.Spinner.Large />
		</section>
	);
}
