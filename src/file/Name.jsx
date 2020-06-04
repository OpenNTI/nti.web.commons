import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Text from '../text';

import Styles from './Name.css';

const cx = classnames.bind(Styles);

function getParts (file) {
	const name = typeof file === 'string' ? file : file.filename;

	const parts = name.split('.');
	const ext = parts.pop();
	const filename = parts.join('.');

	return {ext, name: filename};
}

FileName.getParts = getParts;
FileName.propTypes = {
	className: PropTypes.string,
	file: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.shape({
			filename: PropTypes.string
		})
	]).isRequired
};
export default function FileName ({className, file, ...otherProps}) {
	const {ext, name} = getParts(file);

	return (
		<Text.Base className={cx('file-name', className)} {...otherProps} >
			{name && (<span className={cx('name')}>{name}</span>)}
			{ext && (<span className={cx('ext')}>.{ext}</span>)}
		</Text.Base>
	);
}