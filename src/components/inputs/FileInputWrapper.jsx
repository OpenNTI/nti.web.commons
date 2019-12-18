import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './FileInputWrapper.css';

const cx = classnames.bind(Styles);

// const stop = e => e.stopPropagation();
const fullStop = e => (e.stopPropagation() , e.preventDefault());

export default class FileInputWrapper extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		children: PropTypes.any,
		style: PropTypes.any,
		onDragOver: PropTypes.func
	}

	onDragOver = (e) => {
		const {onDragOver} = this.props;

		e.preventDefault();
		e.stopPropagation();

		if (onDragOver) {
			onDragOver(e);
		}
	}

	render () {
		const {className, children, style, ...otherProps} = this.props;

		const stops = {
			onDrag: fullStop,
			onDragStart: fullStop,
			onDragEnd: fullStop,
			onDragEnter: fullStop,
			onDragLeave: fullStop,
			onDragOver: fullStop,
		};

		return (
			<div className={cx('nti-file-input-wrapper', className)} style={style} {...stops} >
				<input type="file" {...otherProps} />
				{children}
			</div>
		);
	}
}