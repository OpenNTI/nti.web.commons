import React, { PropTypes } from 'react';
import cx from 'classnames';

import {scoped} from 'nti-lib-locale';
import Logger from 'nti-util-logger';
import DateTime from './DateTime';
import DayTimePicker from './day-time/DayTimePicker';
import Flyout from './flyout';
import Radio from './Radio';
import PublishTrigger from './PublishTrigger';
import {PUBLISH_STATES} from '../constants';

const logger = Logger.get('common:components:Publish');

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
		selectedText: 'Lesson contents will be visible to students on %(date)s at %(time)s.',
		label: 'Schedule',
		timePickerHeader: 'YOUR LOCAL TIME'
	}
};

const t = scoped('PUBLISH_CONTROLS', DEFAULT_TEXT);
export const getPublishState = value => PUBLISH_STATES[value] || (value instanceof Date ? PUBLISH_STATES.SCHEDULE : null);


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
		children: PropTypes.any
	}

	static defaultProps = {
		value: PUBLISH_STATES.DRAFT,
		changed: false,
		horizontalAlignment: Flyout.ALIGNMENTS.RIGHT
	}

	constructor (props) {
		super(props);
		this.setupValue(props);
	}


	setFlyoutRef = x => this.flyoutRef = x


	setupValue (props = this.props) {
		const setState = s => this.state ? this.setState(s) : (this.state = s);
		const {value} = props;
		const date = (value instanceof Date) ? value : new Date();

		setState({
			selected: getPublishState(value),
			date,
			dayClicked: false
		});
	}


	componentWillReceiveProps (nextProps) {
		if (nextProps.value !== this.props.value) {
			this.setupValue(nextProps);
		}
	}


	onChange = (e) => {
		const selected = e.target.value;

		this.setState({
			selected,
			changed: true,
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
		const {props: {onChange}, state: {changed}} = this;
		if (onChange && changed) {
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
		const {verticalAlignment:vAlign, horizontalAlignment:hAlign, children, value, error} = this.props;
		const {PUBLISH, DRAFT, SCHEDULE} = PUBLISH_STATES;

		const saveClassNames = cx('flyout-fullwidth-btn', {'changed': changed, error});

		const trigger = <PublishTrigger value={value}/>;

		return (
			<Flyout
				ref={this.setFlyoutRef}
				arrow
				constrain
				className="publish-controls"
				verticalAlign={vAlign}
				horizontalAlign={hAlign}
				trigger={trigger}
				onDismiss={this.onDismiss}
			>
				<Radio name="publish-radio" value={PUBLISH} label={t('publish.label')} checked={PUBLISH === selected} onChange={this.onChange}>
					{t('publish.text')}
				</Radio>
				<Radio name="publish-radio" value={SCHEDULE} label={t('schedule.label')} checked={SCHEDULE === selected} onChange={this.onChange}>
					{dayClicked ? t('schedule.selectedText', {date: date && DateTime.format(date, 'MMMM D'), time: DateTime.format(date, 'LT')}) : t('schedule.text')}
					<DayTimePicker
						value={date}
						onChange={this.onDateChange}
						disablePastNow
					/>
				</Radio>
				<Radio name="publish-radio" value={DRAFT} label={t('draft.label')} checked={DRAFT === selected} onChange={this.onChange}>
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
				<div className={saveClassNames} onClick={this.onSave}>Save</div>
			</Flyout>
		);
	}
}
