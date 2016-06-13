import React, { PropTypes } from 'react';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';
import autobind from 'nti-commons/lib/autobind';
import moment from 'moment';
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
		label: 'Publish',
		buttonLabel: 'Published'
	},
	draft: {
		text: 'Currently not visible to any students',
		label: 'Draft',
		buttonLabel: 'Publish'
	},
	schedule: {
		text: 'When do you want students to have access to this lesson?',
		label: 'Schedule',
		buttonLabel: 'Schedule for %(date)s'
	}
};

const t = scoped('PUBLISH_CONTROLS', DEFAULT_TEXT);

export default class Publish extends React.Component {

	static States = PUBLISH_STATES;

	static propTypes = {
		value: PropTypes.oneOfType([
			PropTypes.instanceOf(Date),
			PropTypes.oneOf(Object.keys(PUBLISH_STATES))
		]),
		onChange: PropTypes.func
	}

	static defaultProps = {
		value: PUBLISH_STATES.DRAFT,
		onChange: () => {
			console.warn('Pass on change prop');
		},
		changed: false
	}

	constructor (props) {
		super(props);

		this.setupValue(props);

		this.setFlyoutRef = x => this.flyoutRef = x;

		autobind(this, 'onChange', 'onDateChange', 'onSave');
	}


	setupValue (props = this.props) {
		const setState = s => this.state ? this.setState(s) : (this.state = s);
		const {value} = props;
		const date = (value instanceof Date) ? value : new Date();

		setState({
			selected: PUBLISH_STATES[value] || (value instanceof Date ? PUBLISH_STATES.SCHEDULE : null),
			date
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
			selected,
			changed: true
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
			date,
			changed: true
		});
	}


	onSave () {
		const { onChange } = this.props;
		onChange(this.getValue());
	}


	getValue () {
		const {selected, date} = this.state;
		return selected === PUBLISH_STATES.SCHEDULE ? date : selected;
	}


	closeMenu () {
		if (this.flyoutRef) {
			this.flyoutRef.dismiss();
		}
	}


	renderTrigger () {
		const {selected, date} = this.state;
		const classNames = cx('publish-trigger', selected.toLowerCase());

		const label = t(`${selected.toLowerCase()}.buttonLabel`, {date: date && moment(date).format('MMM D')});

		return (
			<div className={classNames}>
				<span className="publish-trigger-text">
					{label}
				</span>
			</div>
		);
	}


	render () {
		const {selected, date, changed} = this.state;
		const {PUBLISH, DRAFT, SCHEDULE} = PUBLISH_STATES;
		const saveClassNames = cx('publish-save', {'changed': changed});
		return (
			<Flyout ref={this.setFlyoutRef} className="publish-controls" alignment="bottom-right" trigger={this.renderTrigger()}>
				<div className="arrow"/>
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
				<div className={saveClassNames} onClick={changed === true ? this.onSave : null}>Save</div>
			</Flyout>
		);
	}
}
