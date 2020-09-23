import './Publish.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import Logger from '@nti/util-logger';

import {PUBLISH_STATES} from '../constants';
import * as Flyout from '../flyout';
import {DateTime, DayTimePicker} from '../';

import Radio from './Radio';
import PublishTrigger, {getPublishState} from './PublishTrigger';

export {
	getPublishState
};

const logger = Logger.get('common:components:Publish');

const DEFAULT_TEXT = {
	lesson: {
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
			selectedText: 'Lesson contents will be visible to students on %(date)s at %(time)s.',
			label: 'Schedule',
			timePickerHeader: 'YOUR LOCAL TIME'
		}
	},
	assignment: {
		publish: {
			text: 'Assignment contents are visible to students.',
			label: 'Publish'
		},
		draft: {
			text: 'Currently not visible to any students',
			label: 'Draft'
		},
		schedule: {
			text: 'When do you want students to have access to this assignment?',
			selectedText: 'Assignment contents will be visible to students on %(date)s at %(time)s.',
			label: 'Schedule',
			timePickerHeader: 'YOUR LOCAL TIME'
		}
	},
	survey: {
		publish: {
			text: 'Survey contents are visible to students.',
			label: 'Publish'
		},
		draft: {
			text: 'Currently not visible to any students',
			label: 'Draft'
		},
		schedule: {
			text: 'When do you want students to have access to this survey?',
			selectedText: 'Survey contents will be visible to students on %(date)s at %(time)s.',
			label: 'Schedule',
			timePickerHeader: 'YOUR LOCAL TIME'
		}
	},
	save: 'Save',
	saveChanges: 'Save Changes'
};

const tt = scoped('common.components.publish-controls', DEFAULT_TEXT);

const CHANGES = {
	[PUBLISH_STATES.DRAFT]: true,
	[PUBLISH_STATES.PUBLISH]: true,
	[PUBLISH_STATES.SCHEDULE]: false
};
export const changeOccur = value => CHANGES[value];


export default class Publish extends React.Component {

	static States = PUBLISH_STATES;

	static evaluatePublishStateFor (object) {
		if (typeof object.isPublished !== 'function' || typeof object.getPublishDate !== 'function') {
			throw new TypeError('Argument does not conform to expected interface!');
		}

		const NOW = new Date();
		const isPublished = object.isPublished();
		const publishDate = object.getPublishDate();
		const hasPublishDatePassed = publishDate && (publishDate < NOW);


		if (isPublished || hasPublishDatePassed) {
			return Publish.States.PUBLISH;
		}
		else if (!isPublished && publishDate) {
			return new Date(publishDate);
		}
		else if (!isPublished) {
			return Publish.States.DRAFT;
		}

		else {
			logger.warn('Not expected. The node should be published if its lesson is published: %o', object);
		}
	}

	static propTypes = {
		value: PropTypes.oneOfType([
			PropTypes.instanceOf(Date),
			PropTypes.oneOf(Object.keys(PUBLISH_STATES))
		]),
		onChange: PropTypes.func,
		onDismiss: PropTypes.func,
		verticalAlignment: PropTypes.string,
		horizontalAlignment: PropTypes.string,
		error: PropTypes.string,
		children: PropTypes.any,
		hasChanges: PropTypes.bool,
		disableDraft: PropTypes.bool,
		disableSave: PropTypes.bool,
		localeContext: PropTypes.oneOf([
			'lesson',
			'assignment',
			'survey'
		])
	}

	static defaultProps = {
		value: PUBLISH_STATES.DRAFT,
		changed: false,
		horizontalAlignment: Flyout.ALIGNMENTS.RIGHT,
		localeContext: 'assignment'
	}

	constructor (props) {
		super(props);
		this.setupValue(props);
	}


	setFlyoutRef = x => this.flyoutRef = x


	setupValue (props = this.props) {
		//eslint-disable-next-line react/no-direct-mutation-state
		const setState = s => this.state ? this.setState(s) : (this.state = s);
		const {value} = props;

		// Init: Don't start with an initial date when selected schedule
		const date = (value instanceof Date) ? value : null;

		setState({
			selected: getPublishState(value),
			date,
			dayClicked: false,
			changed: false
		});
	}


	componentDidUpdate (prevProps) {
		if (prevProps.value !== this.props.value) {
			this.setupValue();
		}
	}


	onChange = (e) => {
		const selected = e.target.value;
		const {changed, selected: oldSelected} = this.state;

		// NTI-2144: This is for when the past selected is schedule and there was a change and there is a click inside the scheduler that isn't a date change.
		const scheduleChange = oldSelected === PUBLISH_STATES.SCHEDULE && changed === true && selected === PUBLISH_STATES.SCHEDULE;

		this.setState({
			selected,
			changed: scheduleChange ? true : changeOccur(selected),
			dayClicked: false
		});
	}


	onDateChange = (date) => {
		this.setState({
			date,
			changed: true,
			dayClicked: true
		});
	}


	onSave = () => {
		const {props: {onChange, hasChanges}, state: {changed}} = this;
		if (onChange && (changed || hasChanges)) {
			this.setState({changed: false});
			const p = onChange(this.getValue());

			if (p && p.then) {
				p.then(()=> this.closeMenu());
			}
		}
	}


	getValue () {
		const {selected, date} = this.state;
		return selected === PUBLISH_STATES.SCHEDULE ? date : selected;
	}


	closeMenu = () => {
		if (this.flyoutRef) {
			this.flyoutRef.dismiss();
		}
	}


	onDismiss = () => {
		const {onDismiss} = this.props;
		this.setupValue();
		if (onDismiss) {
			onDismiss();
		}
	}


	render () {
		const {selected, date, changed, dayClicked} = this.state;
		const {
			verticalAlignment:vAlign,
			horizontalAlignment:hAlign,
			children,
			value,
			error,
			localeContext,
			hasChanges,
			disableDraft,
			disableSave
		} = this.props;

		const saveClassNames = cx(
			'flyout-fullwidth-btn',
			{
				'changed': changed || hasChanges,
				error,
				'disabled': disableSave
			}
		);

		const trigger = <PublishTrigger value={value} hasChanges={hasChanges} />;

		const t = (key,...args) => tt(`${localeContext}.${key}`,...args);

		return (
			<Flyout.Triggered
				ref={this.setFlyoutRef}
				arrow
				constrain
				className="publish-controls"
				verticalAlign={vAlign}
				horizontalAlign={hAlign}
				trigger={trigger}
				onDismiss={this.onDismiss}
			>
				<Radio name="publish-radio" value={PUBLISH_STATES.PUBLISH} label={t('publish.label')} checked={PUBLISH_STATES.PUBLISH === selected} onChange={this.onChange}>
					{t('publish.text')}
				</Radio>
				<Radio name="publish-radio" value={PUBLISH_STATES.SCHEDULE} label={t('schedule.label')} checked={PUBLISH_STATES.SCHEDULE === selected} onChange={this.onChange}>
					{dayClicked ? t('schedule.selectedText', {date: date && DateTime.format(date, 'MMMM D'), time: DateTime.format(date, 'LT')}) : t('schedule.text')}
					<DayTimePicker
						value={date}
						onChange={this.onDateChange}
						disablePastNow
					/>
				</Radio>
				<Radio
					name="publish-radio"
					value={PUBLISH_STATES.DRAFT}
					label={t('draft.label')}
					checked={PUBLISH_STATES.DRAFT === selected}
					onChange={this.onChange}
					disabled={disableDraft}
				>
					{t('draft.text')}
				</Radio>
				{children && (
					<div>
						{children}
					</div>
				)}
				{error && (
					<div className="error-message">{error}</div>
				)}
				<div className={saveClassNames} onClick={this.onSave}>
					{hasChanges ? tt('saveChanges') : tt('save')}
				</div>
			</Flyout.Triggered>
		);
	}
}
