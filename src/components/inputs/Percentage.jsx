import './Percentage.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

import Number from './Number';

const t = scoped('web-commons.components.inputs.Percentage', {
	placeholder: 'Enter a percentage'
});

export default class PercentageInput extends React.Component {
	static propTypes = {
		placeholder: PropTypes.string,
		disabled: PropTypes.bool
	}

	static defaultProps = {
		placeholder: t('placeholder')
	}

	render () {
		const {disabled, ...otherProps} = this.props;

		delete otherProps.min;
		delete otherProps.max;

		return (
			<div className={cx('nti-percentage-input', {disabled})}>
				<Number min={0} max={100} disabled={disabled} {...otherProps}/>
				<div className="symbol">%</div>
			</div>
		);
	}
}
