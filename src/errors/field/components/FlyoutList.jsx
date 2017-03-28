import React from 'react';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';

import {Flyout} from '../../../components';

import List from './List';

const defaultText = {
	warnings: {
		zero: 'No Warnings',
		one: '%(count)s Warning',
		other: '%(count)s Warnings'
	},
	errors: {
		zero: 'No Errors',
		one: '%(count)s Error',
		other: '%(count)s Errors'
	}
};
const t = scoped('FIELD_ERROR_FLYOUT', defaultText);

const DEFAULT_ALIGNMENT = 'top-center';

function renderTrigger (errors, isWarnings) {
	const cls = cx('nti-error-flyout-trigger', {warning: isWarnings});

	return (
		<div className={cls}>
			<i className="icon-alert" />
			<span>{t(isWarnings ? 'warnings' : 'errors', {count: errors.length})}</span>
		</div>
	);
}

function renderFlyout (errors, isWarnings, alignment) {
	return (
		<Flyout.Triggered arrow alignment={alignment} trigger={renderTrigger(errors, isWarnings)}>
			<List errors={errors} isWarnings={isWarnings} />
		</Flyout.Triggered>
	);
}

ErrorListFlyout.propTypes = {
	errors: React.PropTypes.array,
	warnings: React.PropTypes.array,
	alignment: React.PropTypes.string
};

function ErrorListFlyout ({
	errors = [],
	warnings = [],
	alignment = DEFAULT_ALIGNMENT
}) {
	return (
		<div className="nti-error-flyout-list">
			{errors.length ? renderFlyout(errors, false, alignment) : null}
			{warnings.length ? renderFlyout(warnings, true, alignment) : null}
		</div>
	);
}

export {
	renderTrigger,
	renderFlyout
};

export default ErrorListFlyout;
