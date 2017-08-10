import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';

import * as Flyout from '../flyout';

import DayTimeToggleTrigger from './DayTimeToggleTrigger';
import DayTimePicker from './DayTimePicker';

const TOGGLE = {
	BEGIN: 'availableBeginning',
	END: 'availableEnding'
};

const DEFAULT_TEXT = {
	'date-error-availableBeginning': 'Begin Date cannot come after Finish Date.',
	'date-error-availableEnding': 'Finish Date cannot come before Begin Date.'
};

const t = scoped('common.components.day-time.DayTimeToggle', DEFAULT_TEXT);

export default class DayTimeToggle extends React.Component {
	static propTypes = {
		availableBeginning: PropTypes.instanceOf(Date),
		availableEnding: PropTypes.instanceOf(Date),
		disableText: PropTypes.bool,
		onChange: PropTypes.func
	}

	static defaultProps = {
		availableBeginning: null,
		availableEnding: null,
		disableText: false
	}

	constructor (props) {
		super(props);

		this.setFlyoutRef = x => this.flyoutRef = x;

		this.setupValue();
	}


	componentWillReceiveProps (nextProps) {
		if (nextProps.availableBeginning !== this.props.availableBeginning || nextProps.availableEnding !== this.props.availableEnding) {
			this.setupValue(nextProps);
		}
	}


	setupValue (props = this.props) {
		//eslint-disable-next-line react/no-direct-mutation-state
		const setState = s => this.state ? this.setState(s) : (this.state = s);
		const {availableBeginning, availableEnding} = props;

		setState({
			error: false,
			availableBeginning,
			availableEnding,
			active: TOGGLE.BEGIN
		});
	}


	onSave = () => {
		const {availableBeginning, availableEnding, active} = this.state;
		const {onChange} = this.props;

		if (this[active + 'Disabled'](this.state[active])) {
			this.setState({error: true});
			return;
		}

		if (onChange) {
			this.setState({changed: false});

			onChange(availableBeginning, availableEnding);

			this.closeMenu();
		}
	}


	closeMenu = () => {
		if (this.flyoutRef) {
			this.flyoutRef.dismiss();
		}
		this.reset();
	}


	reset = () => {
		this.setupValue();
	}

	onToggle = ({target}) => {
		const {active} = this.state;
		if(!this.state[TOGGLE.BEGIN] && active === TOGGLE.BEGIN || target.getAttribute('name') === active) {
			return;
		}

		this.setState({
			active: active === TOGGLE.BEGIN ? TOGGLE.END : TOGGLE.BEGIN
		});
	}


	onDateChange = (date) => {
		const {active} = this.state;

		this.setState({
			[active]: date,
			changed: true,
			error: false
		});
	}


	onClear = (e) => {
		e.preventDefault();
		e.stopPropagation();

		const {onChange} = this.props;

		if (onChange) {
			onChange(null, null);

			this.closeMenu();
		}
	}

	availableBeginningDisabled = (date) => {
		const {availableEnding: end} = this.state;

		if (end && date > end) {
			return true;
		} else {
			return false;
		}
	}


	availableEndingDisabled = (date) => {
		const {availableBeginning: begin} = this.state;

		if (begin && date < begin) {
			return true;
		} else {
			return false;
		}
	}


	render () {
		const {active, changed, error} = this.state;
		const {availableBeginning: begin, availableEnding: end, disableText} = this.props;

		const trigger = <DayTimeToggleTrigger availableBeginning={begin} availableEnding={end} onChange={this.onClear} disableText={disableText}/>;

		const beginClassNames = cx('part beginning', {active: active === TOGGLE.BEGIN});
		const endClassNames = cx('part ending', {active: active === TOGGLE.END}, {disabled: !this.state[TOGGLE.BEGIN]});
		const btnClassNames = cx('flyout-fullwidth-btn', {changed: changed, error});

		return (
			<Flyout.Triggered ref={this.setFlyoutRef} className="daytime-toggle" horizontalAlign={Flyout.ALIGNMENTS.LEFT} trigger={trigger} onDismiss={this.reset} arrow>
				<div className="toggle">
					<div className={beginClassNames} name={TOGGLE.BEGIN} onClick={this.onToggle}>Begin Date</div>
					<div className={endClassNames} name={TOGGLE.END} onClick={this.onToggle}>Finish Date</div>
				</div>
				<DayTimePicker
					value={this.state[active]}
					onChange={this.onDateChange}
				/>
				{error && (
					<div className="date-error">{t(`date-error-${active}`)}</div>
				)}
				<div className={btnClassNames} onClick={this.onSave}>Save</div>
			</Flyout.Triggered>
		);
	}
}
