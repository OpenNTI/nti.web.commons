import React, {PropTypes} from 'react';
import cx from 'classnames';

import {scoped} from 'nti-lib-locale';
import DateTime from './DateTime';
import Publish, {getPublishState} from './Publish';

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

const t = scoped('PUBLISH_TRIGGER', DEFAULT_TEXT);

export default function PublishTrigger (props) {
	const {value} = props;
	const selected = getPublishState(value);
	const date = selected === Publish.States.SCHEDULE ? value : null;
	const classNames = cx('publish-trigger', selected.toLowerCase());

	const label = t(`${selected.toLowerCase()}.buttonLabel`, {date: date && DateTime.format(date,'MMM D')});

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
		PropTypes.oneOf(Object.keys(Publish.States))
	])
};
