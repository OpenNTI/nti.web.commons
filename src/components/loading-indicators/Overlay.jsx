import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { scoped } from '@nti/lib-locale';

import { Mount } from '../../transitions';
import Text from '../../text';

import Styles from './Overlay.css';
import Spinner from './Spinner';

const cx = classnames.bind(Styles);
const t = scoped('common.components.loading-indicators.Overlay', {
	label: 'Loading...',
});

LoadingOverlay.propTypes = {
	className: PropTypes.string,
	loading: PropTypes.bool,
	label: PropTypes.string,

	large: PropTypes.bool,
};
export default function LoadingOverlay({
	className,
	loading,
	label = t('label'),
	large,
	...otherProps
}) {
	return (
		<Mount mount={loading}>
			<div
				className={cx('loading-overlay', className, { large })}
				{...otherProps}
			>
				{label && (
					<Text.Base className={cx('message')}>{label}</Text.Base>
				)}
				{!large && <Spinner />}
				{large && <Spinner.Large />}
			</div>
		</Mount>
	);
}
