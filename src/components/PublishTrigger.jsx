import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

import {PUBLISH_STATES} from '../constants';

import DateTime from './DateTime';
import {getPublishState} from './Publish';

const DEFAULT_TEXT = {
	publish: {
		buttonLabel: 'Published'
	},
	draft: {
		buttonLabel: 'Publish'
	},
	schedule: {
		buttonLabel: 'Schedule for %(date)s'
	}
};

const t = scoped('common.components.publish-controls.trigger', DEFAULT_TEXT);

export default function PublishTrigger (props) {
	const {value, label:labelOverride} = props;
	const selected = getPublishState(value || PUBLISH_STATES.DRAFT);
	const date = selected === PUBLISH_STATES.SCHEDULE ? value : null;
	const classNames = cx('publish-trigger', selected.toLowerCase());

	const label = labelOverride || t(`${selected.toLowerCase()}.buttonLabel`, {date: date && DateTime.format(date,'MMM D')});

	return (
		<div {...props} className={classNames}>
			<span className="publish-trigger-text">
				{label}
			</span>
		</div>
	);
}

PublishTrigger.propTypes = {
	value: PropTypes.oneOfType([
		PropTypes.instanceOf(Date),
		PropTypes.oneOf(Object.keys(PUBLISH_STATES))
	]),
	label: PropTypes.string
};
