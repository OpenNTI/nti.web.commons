import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Color} from '@nti/lib-commons';

import Styles from './Swatch.css';

const cx = classnames.bind(Styles);

export default class Swatch extends Component {


	static propTypes = {
		swatch: PropTypes.shape({
			color: PropTypes.instanceOf(Color),
			title: PropTypes.string,
		}),
		onChange: PropTypes.func,
	}

	onChange = (e) => {

		const {onChange} = this.props;

		const value = Color.fromHex(this.props.swatch.hex);


		if (onChange) {
			onChange(value);
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

	render () {
		return (
			<label className={cx('label')}>
				<input type="radio" className={cx('radio')} onClick={this.onChange}/>
				<span style={this.coloredCircle(this.props.swatch.hex)} alt={this.props.swatch.title}></span>
			</label>
		);
	}
}
