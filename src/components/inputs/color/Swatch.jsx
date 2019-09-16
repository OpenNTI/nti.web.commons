import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {Color} from '@nti/lib-commons';

export default class Swatch extends Component {

	static propTypes = {
		swatch: PropTypes.shape({
			color: PropTypes.string,
			title: PropTypes.string,
		}),
		onChange: PropTypes.func
	}

	onChange = (e) => {

		const {onChange} = this.props;

		if (onChange) {
			onChange(Color.fromHex(this.props.swatch.color));
		}
	}

	coloredCircle (backgroundColor) {
		return{
			height: '50px',
			width: '50px',
			marginRight: '15px',
			marginTop: '5px',
			marginBottom: '5px',
			borderRadius: '50%',
			backgroundColor: backgroundColor,
			border: '1px solid black',
			display: 'inline-block',
			cursor: 'pointer',
		};
	}

	radio () {
		return {
			opacity: '0',
			width: '0px',
			height: '0px',
		};
	}

	label () {
		return {
			width: 'auto',
		};
	}

	render () {
		return (
			<label style={this.label()}>
				<input type="radio" style={this.radio()} onClick={this.onChange}/>
				<span style={this.coloredCircle(this.props.swatch.color)} alt={this.props.swatch.title}></span>
			</label>
		);
	}
}
