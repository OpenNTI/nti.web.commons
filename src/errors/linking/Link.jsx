import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import {Message} from '../components';

import Styles from './Styles.css';
import {getTarget} from './Store';

const cx = classnames.bind(Styles);

ErrorLink.propTypes = {
	error: PropTypes.any,
	className: PropTypes.string
};
export default function ErrorLink ({error, className, ...otherProps}) {
	const target = getTarget(error);

	return (
		<Message
			className={cx('error-link', className, {disabled: !target})}

			error={error}
			as="a"
			role="button"

			href={`#${target?.name ?? ''}`}

			label={target.label}

			{...otherProps}
		/>
	);
}
