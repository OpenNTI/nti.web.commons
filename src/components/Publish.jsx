import React, { PropTypes } from 'react';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';
import autobind from 'nti-commons/lib/autobind';

import Radio from './Radio';
import DayPicker, {DateUtils} from './DayPicker';
import TimePicker from './TimePicker';
import Flyout from './Flyout';

export const PUBLISH_STATES = {
	DRAFT: 'DRAFT',
	PUBLISH: 'PUBLISH',
	SCHEDULE: 'SCHEDULE'
};

const DEFAULT_TEXT = {
	publish: {
		text: 'Lesson contents are visible to students.',
		label: 'Publish'
	},
	draft: {
		text: 'Currently not visible to any students',
		label: 'Draft'
	},
	schedule: {
		text: 'When do you want students to have access to this lesson?',
		label: 'Schedule'
	},
	buttonLabel: 'Publish'
};

const t = scoped('PUBLISH_CONTROLS', DEFAULT_TEXT);

export default class Publish extends React.Component {

	static propTypes = {
		value: PropTypes.oneOfType([
			PropTypes.instanceOf(Date),
			PropTypes.oneOf(Object.keys(PUBLISH_STATES))
		])
	}

	static defaultProps = {
		value: PUBLISH_STATES.DRAFT
	}

	constructor (props) {
		super(props);

		this.setupValue(props);

		autobind(this, 'onChange', 'onDateChange');
	}


	setupValue (props = this.props) {
		const setState = s => this.state ? this.setState(s) : (this.state = s);
		const {value} = props;

		setState({
			selected: PUBLISH_STATES[value] || (value instanceof Date ? PUBLISH_STATES.SCHEDULE : null),
			date: (value instanceof Date) ? value : new Date()
		});
	}


	componentWillReceiveProps (nextProps) {
		if (nextProps.value !== this.props.value) {
			this.setupValue(nextProps);
		}
	}

	onChange (e) {
		const selected = e.target.value;

		this.setState({
			selected
		});
	}


	onDateChange (date) {
		//prevent time picker from rolling us too far back.
		if (DateUtils.isPastDay(date)) {
			let today = new Date();
			today.setHours(date.getHours(), date.getMinutes(), 0, 0);
			date = today;
		}

		this.setState({
			date
		});
	}


	renderTrigger () {
		const {value} = this.props;

		const classNames = cx('publish-trigger', value);

		return (
			<div className={classNames}>
				<span className="publish-trigger-text">
					{t('buttonLabel')}
				</span>
			</div>
		);
	}


	render () {
		const {selected, date} = this.state;
		const {PUBLISH, DRAFT, SCHEDULE} = PUBLISH_STATES;
		return (
			<Flyout className="publish-controls" trigger={this.renderTrigger()}>
				<Radio name="publish-radio" value={PUBLISH} label={t('publish.label')} checked={PUBLISH === selected} onChange={this.onChange}>
					{t('publish.text')}
				</Radio>
				<Radio name="publish-radio" value={SCHEDULE} label={t('schedule.label')} checked={SCHEDULE === selected} onChange={this.onChange}>
					{t('schedule.text')}
					<DayPicker
						value={date}
						disabledDays={DateUtils.isPastDay}
						onChange={this.onDateChange}
					/>
					<div className="TimePicker-Header-Text">YOUR LOCAL TIME</div>
					<TimePicker
						value={date}
						onChange={this.onDateChange}
					/>
				</Radio>
				<Radio name="publish-radio" value={DRAFT} label={t('draft.label')} checked={DRAFT === selected} onChange={this.onChange}>
					{t('draft.text')}
				</Radio>
				<div className="publish-save" onClick={this.onSave}>Save</div>
			</Flyout>
		);
	}
}
