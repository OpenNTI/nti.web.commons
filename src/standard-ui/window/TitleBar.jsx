import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import * as Icons from '../../icons';

import Styles from './TitleBar.css';

const cx = classnames.bind(Styles);

TitleBar.propTypes = {
	closeLink: PropTypes.any,
	onClose: PropTypes.func,
	title: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.node
	])
};
export default function TitleBar ({closeLink, onClose, title}) {
	const closeIcon = (<Icons.X className={cx('close-icon')} onClick={onClose} />);

	return (
		<div className={cx('nt-title-bar')}>
			{
				closeLink ?
					React.cloneElement(closeLink, {}, closeIcon) :
					closeIcon
			}
			<div className={cx('title-container')}>
				{title}
			</div>
		</div>
	);
}