import React from 'react';
import PropTypes from 'prop-types';

import { Sticky as ReactSticky } from '@nti/react-sticky';

export default class Sticky extends React.Component {
	static propTypes = {
		children: PropTypes.node,
		topOffset: PropTypes.number,
	};

	static contextTypes = {
		stickyTopOffset: PropTypes.number.isRequired,
	};

	constructor(props) {
		super(props);
	}

	getOffset(offset) {
		let topOffset = 0;

		if (offset) {
			topOffset = -offset;
		}

		return {
			topOffset,
			offset,
		};
	}

	render() {
		const { children, topOffset: offsetProp } = this.props;
		const { stickyTopOffset } = this.context;
		const { offset, topOffset } = this.getOffset(
			(stickyTopOffset || 0) + (offsetProp || 0)
		);
		const child = React.Children.only(children);

		return (
			<ReactSticky topOffset={topOffset}>
				{({ style }) => {
					if (offset && style.top != null && style.top === 0) {
						style.top += offset;
					}

					return (
						<div className="sticky" style={style}>
							{child}
						</div>
					);
				}}
			</ReactSticky>
		);
	}
}
