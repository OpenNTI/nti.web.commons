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

export default class PublishTrigger extends React.PureComponent {
	static propTypes = {
		value: PropTypes.oneOfType([
			PropTypes.instanceOf(Date),
			PropTypes.oneOf(Object.keys(PUBLISH_STATES))
		]),
		label: PropTypes.string
	}

	ref = React.createRef()

	getDOMNode () {
		return this.ref.current;
	}

	render () {
		const {value, label:labelOverride, ...props} = this.props;
		const selected = getPublishState(value || PUBLISH_STATES.DRAFT);
		const date = selected === PUBLISH_STATES.SCHEDULE ? value : null;
		const classNames = cx('publish-trigger', selected.toLowerCase());

		const label = labelOverride || t(`${selected.toLowerCase()}.buttonLabel`, {date: date && DateTime.format(date,'MMM D')});

		return (
			<div {...props} ref={this.ref} className={classNames}>
				<span className="publish-trigger-text">
					{label}
				</span>
			</div>
		);
	}
}
