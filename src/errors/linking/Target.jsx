import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {v4 as uuid} from 'uuid';

import {Message} from '../components';

import Styles from './Styles.css';
import {registerTarget} from './Store';

const cx = classnames.bind(Styles);

ErrorTarget.propTypes = {
	error: PropTypes.any,
	label: PropTypes.string,
	className: PropTypes.string
};
export default function ErrorTarget ({error, className, label, ...otherProps}) {
	const [name, setName] = React.useState(null);

	React.useEffect(() => {
		const id = uuid();

		setName(id);

		return registerTarget(error, {name: id, label});
	}, [error]);

	return (
		<Message
			as="a"
			className={cx('error-target', className)}
			error={error}
			name={name}
			{...otherProps}
		/>
	);
}
