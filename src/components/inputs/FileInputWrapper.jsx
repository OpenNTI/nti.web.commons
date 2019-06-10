import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './FileInputWrapper.css';

const cx = classnames.bind(Styles);

export default class FileInputWrapper extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		children: PropTypes.any
	}

	render () {
		const {className, children, ...otherProps} = this.props;

		return (
			<div className={cx('nti-file-input-wrapper', className)}>
				<input type="file" {...otherProps} />
				{children}
			</div>
		);
	}
}