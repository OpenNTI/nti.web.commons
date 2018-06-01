import React from 'react';
import PropTypes from 'prop-types';

export default class FillToBottom extends React.Component {
	static propTypes = {
		padding: PropTypes.number,
		limit: PropTypes.bool
	}


	static defaultProps = {
		padding: 20
	}

	attachRef = x => {
		this.ref = x;
		this.forceUpdate();
	}

	render () {
		const {padding, limit, ...otherProps} = this.props;
		const style = {};
		const property = limit ? 'height' : 'minHeight';
		const top = this.ref ? this.ref.getBoundingClientRect().top : 0;

		style[property] = `calc(100vh - ${padding}px - ${top}px)`;

		return (
			<div ref={this.attachRef} style={style} {...otherProps} />
		);
	}
}
