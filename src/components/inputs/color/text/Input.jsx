import React from 'react';
import classnames from 'classnames/bind';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';

import Select from '../../../Select';

import Styles from './Input.css';
import Hex from './Hex';
import HSL from './HSL';
import RGB from './RGB';

const cx = classnames.bind(Styles);
const t = scoped('common.inputs.color.text.Input', {
	hex: 'HEX',
	hsl: 'HSL',
	rgb: 'RGB',
});

const types = {
	hex: Hex,
	hsl: HSL,
	rgb: RGB,
};

export default class ColorTextInput extends React.Component {
	static Hex = Hex;
	static HSL = HSL;
	static RGB = RGB;

	static propTypes = {
		className: PropTypes.string,
	};

	state = { selected: 'hex' };

	changeMode = e => this.setState({ selected: e.target.value });

	render() {
		const { className, ...otherProps } = this.props;
		const { selected } = this.state;
		const Cmp = types[selected];

		return (
			<div className={cx('nti-color-text-input', className)}>
				<Select value={selected} onChange={this.changeMode}>
					<option value="hex">{t('hex')}</option>
					<option value="hsl">{t('hsl')}</option>
					<option value="rgb">{t('rgb')}</option>
				</Select>
				<Cmp {...otherProps} />
			</div>
		);
	}
}
