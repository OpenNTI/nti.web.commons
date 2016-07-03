import React from 'react';
import cx from 'classnames';

import {Flyout} from '../../../components';

import List from './List';

const DEFAULT_ERROR_LABEL = 'Issues';
const DEFAULT_WARNING_LABEL = 'Warnings';
// const ALIGNMENT = 'top center';

function renderTrigger (errors, isWarnings, label) {
	const cls = cx('nti-error-flyout-trigger', {warning: isWarnings});

	//TODO: localize this to do the pluralization
	return (
		<div className={cls}>
			{`${errors.length} ${label}`}
		</div>
	);
}

function renderFlyout (errors, isWarnings, label) {
	return (
		<Flyout arrow trigger={renderTrigger(errors, isWarnings, label)}>
			<List errors={errors} isWarnings={isWarnings} />
		</Flyout>
	);
}

ErrorListFlyout.propTypes = {
	errors: React.PropTypes.array,
	warnings: React.PropTypes.array,
	alignment: React.PropTypes.string,
	errorsLabel: React.PropTypes.string,
	warningsLabel: React.PropTypes.string
};

function ErrorListFlyout ({
	errors = [],
	warnings = [],
	errorsLabel = DEFAULT_ERROR_LABEL,
	warningsLabel = DEFAULT_WARNING_LABEL
}) {
	return (
		<div className="nti-error-flyout-list">
			{errors.length && renderFlyout(errors, false, errorsLabel)}
			{warnings.length && renderFlyout(warnings, true, warningsLabel)}
		</div>
	);
}

export {
	renderTrigger,
	renderFlyout
};

export default ErrorListFlyout;
