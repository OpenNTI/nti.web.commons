import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Text from '../../text';
import  {getMessage} from '../messages';

import Styles from './Message.css';

const cx = classnames.bind(Styles);

ErrorMessage.propTypes = {
	className: PropTypes.string,
	error: PropTypes.any
};
export default function ErrorMessage ({className, error, ...otherProps}) {
	const empty = !error;

	return (
		<Text.Base className={cx('nti-error-message', className, {empty})} aria-hidden={empty ? 'true' : 'false'} {...otherProps}>
			{error && getMessage(error)}
		</Text.Base>
	);
}
