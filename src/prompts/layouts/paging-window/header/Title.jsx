import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Text from '../../../../text';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

Title.propTypes = {
	title: PropTypes.string,
	subTitle: PropTypes.string,
	loading: PropTypes.bool,
};
export default function Title({ title, subTitle, loading }) {
	return (
		<div className={cx('title-container', { skeleton: loading })}>
			{title && <Text.Base className={cx('title')}>{title}</Text.Base>}
			{subTitle && (
				<Text.Base className={cx('sub-title')}>{subTitle}</Text.Base>
			)}
		</div>
	);
}
