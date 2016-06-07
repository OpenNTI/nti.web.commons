import React, { PropTypes } from 'react';
import cx from 'classnames';
import Radio from '../Radio';
import DayPicker from '../DayPicker';
import TimePicker from '../TimePicker';
import Flyout from '../Flyout';
export default class Publish extends React.Component {

	static propTypes = {
		publish: PropTypes.object,
		draft: PropTypes.object,
		schedule: PropTypes.object,
		triggerText: PropTypes.string,
		status: PropTypes.string,
	}

	constructor (props) {
		super(props);
		const {status} = this.props;
		const initDate = new Date();

		this.state = {
			selected: status,
			status: status,
			selectedDay: initDate,
			time: initDate
		};

		this.onChange = this.onChange.bind(this);
		this.onDayClick = this.onDayClick.bind(this);
		this.onTimeChange = this.onTimeChange.bind(this);
	}

	static defaultProps = {
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
		triggerText: 'Publish',
		status: 'draft'
	}


	onChange (e) {
		const selected = e.target.value;

		this.setState({
			selected
		});
	}


	onDayClick (day) {
		this.setState({
			selectedDay: day
		});
	}

	onTimeChange (day) {
		this.setState({
			time: day
		});
	}


	onSave () {

	}


	renderTrigger () {
		const {triggerText, status} = this.props;

		const classNames = cx('publish-trigger', status);

		return (
			<div className={classNames}>
				<span className="publish-trigger-text">
					{triggerText}
				</span>
			</div>
		);
	}


	render () {
		const {selected, selectedDay, time} = this.state;
		const {publish, schedule, draft} = this.props;

		return (
			<Flyout className="publish-controls" trigger={this.renderTrigger()}>
				<Radio name="publish" value="publish" label={publish.label} checked={'publish' === selected} onChange={this.onChange}>
					{publish.text}
				</Radio>
				<Radio name="schedule" value="schedule" label={schedule.label} checked={'schedule' === selected} onChange={this.onChange}>
					{schedule.text}
					<DayPicker
						value={selectedDay}
						onChange={this.onDayClick}
					/>
					<div className="TimePicker-Header-Text">YOUR LOCAL TIME</div>
					<TimePicker
						value={time}
						onChange={this.onTimeChange}
					/>
				</Radio>
				<Radio name="draft" value="draft" label={draft.label} checked={'draft' === selected} onChange={this.onChange}>
					{draft.text}
				</Radio>
				<div className="publish-save" onClick={this.onSave}>Save</div>
			</Flyout>
		);
	}
}
