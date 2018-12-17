import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class Badge extends React.Component {
	static POSITIONS = {
		TOP_LEFT: cx('top', 'left'),
		TOP_RIGHT: cx('top', 'right'),
		BOTTOM_LEFT: cx('bottom', 'left'),
		BOTTOM_RIGHT: cx('bottom', 'right')
	};

	static propTypes = {
		viewed: PropTypes.bool,
		badge: PropTypes.number,
		position: PropTypes.oneOf(Badge.POSITIONS.TOP_LEFT, Badge.POSITIONS.TOP_RIGHT, Badge.POSITIONS.BOTTOM_LEFT, Badge.POSITIONS.BOTTOM_RIGHT),
		children: PropTypes.any
	};

	render () {
		const {props: {viewed, badge, position, children}} = this;

		const positionCls = position || Badge.POSITIONS.TOP_RIGHT;

		const badgeProp = badge > 0 ? {'data-badge': badge > 99 ? '!' : badge} : {};
		const props = {...badgeProp};

		return (
			<div className={cx('badged-item', positionCls, { viewed })} {...props}>
				<div className="badged-item-content">
					{children}
				</div>
			</div>
		);
	}
}
