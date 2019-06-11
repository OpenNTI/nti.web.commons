import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';

import {getMessage} from '../messages';

import Styles from './Bar.css';

const cx = classnames.bind(Styles);
const t = scoped('commons.errors.components.Bar', {
	prefix: 'There was a problem.'
});

export default class ErrorBar extends React.PureComponent {
	static propTypes = {
		className: PropTypes.string,
		error: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.shape({
				message: PropTypes.string
			})
		]).isRequired,
		prefix: PropTypes.string
	}

	render () {
		const {className, error, prefix, ...otherProps} = this.props;

		return (
			<div className={cx('nti-error-bar', className)} {...otherProps}>
				<i className="icon-alert" /> <span className={cx('prefix')}>{prefix || (t('prefix'))}</span> <span className={cx('message')}>{getMessage(error)}</span>
			</div>
		);
	}
}