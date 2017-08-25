import React from 'react';
import PropTypes from 'prop-types';
import {Sticky as ReactSticky} from 'react-sticky';

import getEmitter from '../utils/events';

const offsetProp = 'nti-sticky-top-offset';

export default class Sticky extends React.Component {
	static propTypes = {
		children: PropTypes.node
	}

	constructor (props) {
		super(props);

		this.state = this.getOffset();
	}

	onMsgBarUpdated = () => {
		this.updateOffset();
	}

	componentDidMount () {
		getEmitter().addListener('msg-bar-opened', this.onMsgBarUpdated);
		getEmitter().addListener('msg-bar-closed', this.onMsgBarUpdated);
	}

	componentWillUnmount () {
		getEmitter().removeListener('msg-bar-opened', this.onMsgBarUpdated);
		getEmitter().removeListener('msg-bar-closed', this.onMsgBarUpdated);
	}

	updateOffset () {
		this.setState(this.getOffset());
	}

	getOffset () {
		const offset = window && window[offsetProp]();
		let topOffset = 0;

		if (offset) {
			topOffset = -offset;
		}

		return {
			topOffset,
			offset
		};
	}

	render () {
		const { children } = this.props;
		const { offset, topOffset } = this.state;

		return (
			<ReactSticky topOffset={topOffset}>
				{({style}) => {
					if (offset && style.top != null && style.top === 0) {
						style.top += offset;
					}

					return (<div className="sticky" style={style}>{children}</div>);
				}}
			</ReactSticky>
		);
	}
}
