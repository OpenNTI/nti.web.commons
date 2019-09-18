import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Color} from '@nti/lib-commons';
import {scoped} from '@nti/lib-locale';

import Text from '../../Text';

import Styles from './Hex.css';

const cx = classnames.bind(Styles);
const t = scoped('common.inputs.color.text.Hex', {
	placeholder: '#RRGGBB'
});

const ValidHexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
const ValidInput = /^#?[A-Fa-f0-9]{0,6}$/;

function fix (value) {
	if (value.charAt(0) !== '#') { return `#${value}`; }

	return value;
}

function safelyGetColor (value) {
	try {
		return Color.fromHex(value);
	} catch (e) {
		return null;
	}
}

export default class NTIHexInput extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		value: PropTypes.shape({
			isSameColor: PropTypes.func,
			hex: PropTypes.shape({
				toString: PropTypes.func
			})
		}),
		onChange: PropTypes.func
	}

	state = {value: ''}

	componentDidMount () {
		this.setup();
	}

	componentDidUpdate (prevProps) {
		const {value} = this.props;
		const {value: prevValue} = prevProps;

		if (value !== prevValue) {
			this.setup();
		}
	}

	setup () {
		const {value} = this.props;
		const {value:oldValue} = this.state;
		const oldColor = safelyGetColor(oldValue);

		if (!value || !value.isSameColor(oldColor)) {
			this.setState({
				value: value ? value.hex.toString() : ''
			});
		}
	}


	onChange = (value) => {
		if (!ValidInput.test(value)) { return; }

		const {onChange} = this.props;

		this.setState({
			value
		}, () => {
			if (ValidHexRegex.test(value) && onChange) {
				onChange(Color.fromHex(fix(value)));
			}
		});

	}


	render () {
		const {className} = this.props;
		const {value} = this.state;

		return (
			<Text
				className={cx('nti-color-hex-input', className)}
				value={value}
				onChange={this.onChange}
				placeholder={t('placeholder')}
			/>
		);
	}
}
