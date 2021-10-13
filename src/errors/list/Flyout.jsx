import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { scoped } from '@nti/lib-locale';

import { isWarning } from '../messages';
import { Link } from '../linking/';
import Text from '../../text';
import * as Icons from '../../icons';
import { Triggered } from '../../flyout';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

const t = scoped('web-commons.errors.list.Flyout', {
	errors: {
		one: '%(count)s Error',
		other: '%(count)s Errors',
	},
	warnings: {
		one: '%(count)s Warning',
		other: '%(count)s Warnings',
	},
});

ErrorListFlyout.propTypes = {
	errors: PropTypes.array,
};
export default function ErrorListFlyout({ errors }) {
	const types = errors.reduce(
		(acc, error) => {
			if (isWarning(error)) {
				acc.warnings.push(error);
			} else {
				acc.errors.push(error);
			}

			return acc;
		},
		{ errors: [], warnings: [] }
	);

	const labels = [
		<div className={cx('label')} key="errors">
			<Icons.Alert className={cx('icon')} />
			<Text.Base
				className={cx('errors')}
				getString={t}
				localeKey="errors"
				with={{ count: types.errors.length }}
			/>
		</div>,
	];

	if (types.warnings.length > 0) {
		labels.push(
			<div className={cx('label', 'warning')} key="warnings">
				<Icons.Alert className={cx('icon')} />
				<Text.Base
					className={cx('warnings')}
					getString={t}
					localeKey="warnings"
					with={{ count: types.warnings.length }}
				/>
			</div>
		);
	}

	const trigger = <div className={cx('error-flyout-trigger')}>{labels}</div>;
	const sorted = [...types.warnings, ...types.errors];

	return (
		<Triggered trigger={trigger} arrow>
			<ul className={cx('error-list')}>
				{sorted.map((err, index) => (
					<li key={`${index}`}>
						<Link className={cx('error-list-item')} error={err} />
					</li>
				))}
			</ul>
		</Triggered>
	);
}
