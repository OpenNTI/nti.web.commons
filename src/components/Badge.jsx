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

	static offset = (x, y) => ({offset: {x, y}})

	static propTypes = {
		viewed: PropTypes.bool,
		badge: PropTypes.number,
		position: PropTypes.oneOf(Badge.POSITIONS.TOP_LEFT, Badge.POSITIONS.TOP_RIGHT, Badge.POSITIONS.BOTTOM_LEFT, Badge.POSITIONS.BOTTOM_RIGHT),
		children: PropTypes.any,
		offset: PropTypes.shape({
			x: PropTypes.number,
			y: PropTypes.number
		})
	};

	render () {
		const {props: {viewed, badge, position, children, offset: {x = 0, y = 0} = {}}} = this;

		const positionCls = position || Badge.POSITIONS.TOP_RIGHT;
		const style = x === 0 && y === 0 ? {} : {
			...(x !== 0 ? {'--badge-offset-x': `${x}px`} : {}),
			...(y !== 0 ? {'--badge-offset-y': `${y}px`} : {})
		};

		const badgeProp = badge > 0 ? {'data-badge': badge > 99 ? '!' : badge} : {};
		const props = {...badgeProp, 'data-badge': 4, style};

		return (
			<div className={cx('badged-item', positionCls, { viewed })} {...props}>
				<div className="badged-item-content">
					{children}
				</div>
			</div>
		);
	}
}
