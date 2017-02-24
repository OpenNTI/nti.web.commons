import React from 'react';
import cx from 'classnames';

LoadingSpinner.propTypes = {
	white: React.PropTypes.bool,
	blue: React.PropTypes.bool,
	grey: React.PropTypes.bool,
	size: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.number
	]),
	strokeWidth: React.PropTypes.string,
	className: React.PropTypes.string
};
export default function LoadingSpinner ({className, white, grey, size = '25px', strokeWidth = '5'}) {
	const cls = cx('loading-spinner', className, {white, grey, blue: !white && !grey});

	return (
		<div className={cls} style={{width: size}}>
			<svg className="circular" viewBox="25 25 50 50">
				<circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth={strokeWidth} strokeMiterlimit="10"/>
			</svg>
		</div>
	);
}
