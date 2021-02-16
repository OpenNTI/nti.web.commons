import './Badge.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

function getDataBadgeValue(raw) {
	if (typeof raw === 'number') {
		return raw > 0 ? (raw > 99 ? '!' : raw) : null;
	}

	return raw;
}

export default class Badge extends React.Component {
	static POSITIONS = {
		TOP_LEFT: 'top-left',
		TOP_RIGHT: 'top-right',
		CENTER_RIGHT: 'center-right',
		BOTTOM_LEFT: 'bottom-left',
		BOTTOM_RIGHT: 'bottom-right',
	};

	static SIZES = {
		SMALL: 'small',
		LARGE: 'large',
	};

	static THEMES = {
		ALERT: 'alert',
		INACTIVE: 'inactive',
		SUCCESS: 'success',
	};

	static offset = (x, y) => ({ offset: { x, y } });

	static propTypes = {
		viewed: PropTypes.bool,
		badge: PropTypes.number,
		position: PropTypes.oneOf([
			Badge.POSITIONS.TOP_LEFT,
			Badge.POSITIONS.TOP_RIGHT,
			Badge.POSITIONS.BOTTOM_LEFT,
			Badge.POSITIONS.BOTTOM_RIGHT,
		]),
		size: PropTypes.oneOf([Badge.SIZES.SMALL, Badge.SIZES.LARGE]),
		theme: PropTypes.oneOf([
			Badge.THEMES.ALERT,
			Badge.THEMES.SUCCESS,
			Badge.THEMES.INACTIVE,
		]),
		children: PropTypes.any,
		offset: PropTypes.shape({
			x: PropTypes.number,
			y: PropTypes.number,
		}),
	};

	static defaultProps = {
		size: Badge.SIZES.SMALL,
		theme: Badge.THEMES.ALERT,
		position: Badge.POSITIONS.TOP_RIGHT,
	};

	ref = React.createRef();

	getDOMNode() {
		return this.ref.current;
	}

	render() {
		const {
			props: {
				badge,
				position,
				theme,
				size,
				viewed,
				children,
				offset: { x = 0, y = 0 } = {},
			},
		} = this;

		const positionCls = position;
		const needsStyle = !!badge && (x !== 0 || y !== 0);

		const style = needsStyle
			? {
					...(x !== 0 ? { '--badge-offset-x': `${x}px` } : {}),
					...(y !== 0 ? { '--badge-offset-y': `${y}px` } : {}),
			  }
			: {};

		const dataBadgeValue = getDataBadgeValue(badge);

		const badgeProp = dataBadgeValue
			? {
					'data-badge': dataBadgeValue,
			  }
			: {};
		const props = { ...badgeProp, style };

		return (
			<div
				ref={this.ref}
				className={cx(
					'badged-item',
					viewed ? Badge.THEMES.INACTIVE : theme,
					size,
					'success',
					positionCls
				)}
				{...props}
			>
				<div className="badged-item-content">{children}</div>
			</div>
		);
	}
}
