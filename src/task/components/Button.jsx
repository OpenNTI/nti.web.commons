import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { Button, Loading } from '../../components';
import Text from '../../text';

import Styles from './Button.css';

const cx = classnames.bind(Styles);

TaskButton.propTypes = {
	className: PropTypes.string,
	running: PropTypes.bool,
	children: PropTypes.any,
};
export default function TaskButton({
	className,
	running,
	children,
	...otherProps
}) {
	return (
		<Button
			className={cx('task-button', className, { running })}
			{...otherProps}
		>
			<Text.Base className={cx('label')}>{children}</Text.Base>
			{running && <Loading.Spinner white className={cx('spinner')} />}
		</Button>
	);
}
