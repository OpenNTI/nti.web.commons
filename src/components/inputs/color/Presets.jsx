import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Color} from '@nti/lib-commons';
import Swatch from './Swatch';

export default class Presets extends Component {

	static propTypes = {
		presets: PropTypes.arrayOf(
			PropTypes.shape({
				color: PropTypes.instanceOf(Color),
				title: PropTypes.string,
			})),
		onChange: PropTypes.func,
	}

	onChange = (e) => {
		const {onChange} = this.props;

		if (onChange) {
			onChange(e);
		}
	}

	presetDiv () {
		return {
			width: 'auto',
		};
	}


	render () {

		const presets = this.props.presets || {};

		return (
			<div>
				<h3>Presets</h3>
				<div style={this.presetDiv()}>
					{presets && presets.map((swatch, i) => (
						<Swatch key={i} swatch={swatch} onChange={this.onChange}/>
					))}
				</div>
			</div>
		);
	}
}

