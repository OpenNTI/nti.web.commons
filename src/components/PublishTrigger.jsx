import './PublishTrigger.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

import {PUBLISH_STATES} from '../constants';
import {DateTime} from '../';

const DEFAULT_TEXT = {
	publish: {
		buttonLabel: 'Published'
	},
	draft: {
		buttonLabel: 'Publish'
	},
	schedule: {
		buttonLabel: 'Schedule for %(date)s'
	},
	hasChanges: {
		publish: {
			buttonLabel: 'Publish Changes'
		},
		draft: {
			buttonLabel: 'Publish Changes'
		},
		schedule: {
			buttonLabel: 'Publish Changes'
		}
	}
};

const t = scoped('common.components.publish-controls.trigger', DEFAULT_TEXT);

export const getPublishState = value => PUBLISH_STATES[value] || (value instanceof Date ? PUBLISH_STATES.SCHEDULE : null);

export default class PublishTrigger extends React.PureComponent {
	static propTypes = {
		value: PropTypes.oneOfType([
			PropTypes.instanceOf(Date),
			PropTypes.oneOf(Object.keys(PUBLISH_STATES))
		]),
		label: PropTypes.string,
		hasChanges: PropTypes.bool
	}

	ref = React.createRef()

	getDOMNode () {
		return this.ref.current;
	}

	render () {
		const {value, hasChanges, label:labelOverride, ...props} = this.props;
		const selected = getPublishState(value || PUBLISH_STATES.DRAFT);
		const date = selected === PUBLISH_STATES.SCHEDULE ? value : null;
		const classNames = cx('publish-trigger', selected.toLowerCase());

		const label = labelOverride ||
			t(`${hasChanges ? 'hasChanges.' : ''}${selected.toLowerCase()}.buttonLabel`, {date: date && DateTime.format(date,DateTime.MONTH_ABBR_DAY)});

		return (
			<div {...props} ref={this.ref} className={classNames}>
				<div className="publish-trigger-container">
					<span className="publish-trigger-text">
						{label}
					</span>
					<span className="publish-trigger-icon" />
				</div>
			</div>
		);
	}
}
