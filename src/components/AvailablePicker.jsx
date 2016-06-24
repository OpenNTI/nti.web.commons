import React, { PropTypes } from 'react';
import cx from 'classnames';
import autobind from 'nti-commons/lib/autobind';
import DayTimePicker from './DayTimePicker';
import Flyout from './Flyout';
import DateTime from './DateTime';

export default class AvailablePicker extends React.Component {
	static propTypes = {
		value: React.PropTypes.instanceOf(Date),
		label: React.PropTypes.string,
		onChange: PropTypes.func
	}

	static defaultProps = {
		value: new Date(),
		label: 'Available Date',
		onChange: () => {
			console.warn('Pass on change prop');
		},
		changed: false
	}


	constructor (props) {
		super(props);

		this.setupValue(props);

		this.setFlyoutRef = x => this.flyoutRef = x;

		autobind(this, 'onDateChange', 'onSave', 'closeMenu');
	}


	setupValue (props = this.props) {
		const setState = s => this.state ? this.setState(s) : (this.state = s);
		const {value} = props;
		const date = (value instanceof Date) ? value : new Date();

		setState({
			date
		});
	}

	onDateChange (date) {
		this.setState({
			date,
			changed: true,
			dayClicked: true
		});
	}

	onSave () {
		const {props: {onChange}, state: {changed}} = this;
		if (onChange && changed) {
			this.setState({changed: false});
			const p = onChange(this.getValue());

			if (p && p.then) {
				p.then(()=> this.closeMenu());
			}
		}
	}

	renderTrigger () {
		const {label} = this.props;
		const {date} = this.state;
		const classNames = cx('available-trigger');
		const format = 'L';

		return (
			<div className={classNames}>
				<div className="inner-available-trigger">
					<div className="available-label">
						{label}
					</div>
					<div className="available-date">
						<DateTime date={date} format={format} />
					</div>
				</div>
				<div className="arrow"></div>
			</div>
		);
	}

	render () {
		const {date, changed} = this.state;
		const {label} = this.props;
		const saveClassNames = cx('available-save flyout-fullwidth-btn', {'changed': changed});
		return (
			<Flyout ref={this.setFlyoutRef} className="available-picker" alignment="bottom-left" trigger={this.renderTrigger()}>
				{label}
				<DayTimePicker
					value={date}
					onChange={this.onDateChange}
				/>
				<div className={saveClassNames} onClick={changed === true ? this.onSave : null}>Save</div>
			</Flyout>
		);
	}
}
