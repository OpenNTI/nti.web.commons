import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class Badge extends React.Component {
	static POSITIONS = {
		TOP_LEFT: 'top-left',
		TOP_RIGHT: 'top-right',
		BOTTOM_LEFT: 'bottom-left',
		BOTTOM_RIGHT: 'bottom-right'
	};

	static propTypes = {
		viewed: PropTypes.bool,
		badge: PropTypes.number,
		small: PropTypes.bool,
		position: PropTypes.oneOf(Badge.POSITIONS.TOP_LEFT, Badge.POSITIONS.TOP_RIGHT, Badge.POSITIONS.BOTTOM_LEFT, Badge.POSITIONS.BOTTOM_RIGHT),
		children: PropTypes.any
	};

	render () {
		const {props: {viewed, badge, position, small, children}} = this;

		const positionCls = position || Badge.POSITIONS.TOP_RIGHT;

		const badgeProp = badge > 0 ? {'data-badge': badge > 99 ? '!' : badge} : {};
		const props = {...badgeProp};

		return (
			<div className={cx('badged-item', positionCls, { viewed, small })} {...props}>
				<div className="badged-item-content">
					{children}
				</div>
			</div>
		);
	}
}
