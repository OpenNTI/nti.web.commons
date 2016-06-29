import React, {PropTypes} from 'react';
import cx from 'classnames';

import DayTimeToggleTrigger from './DayTimeToggleTrigger';
import DayTimePicker from './DayTimePicker';
import Flyout from '../Flyout';

const TOGGLE = {
	BEGIN: 'availableBeginning',
	END: 'availableEnding'
};

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
		const setState = s => this.state ? this.setState(s) : (this.state = s);
		const {availableBeginning, availableEnding} = props;

		setState({
			availableBeginning,
			availableEnding,
			active: TOGGLE.BEGIN
		});
	}


	onSave = () => {
		const {availableBeginning, availableEnding} = this.state;
		const {onChange} = this.props;

		if (onChange) {
			this.setState({changed: false});
			/*const p = */onChange(availableBeginning, availableEnding);
			this.closeMenu();
			// if (p && p.then) {
			// 	p.then(()=> this.closeMenu());
			// }
		}
	}


	closeMenu = () => {
		if (this.flyoutRef) {
			this.flyoutRef.dismiss();
		}
		this.setupValue();
	}


	onToggle = () => {
		const {active} = this.state;
		if(!this.state[TOGGLE.BEGIN] && active === TOGGLE.BEGIN) {
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
			changed: true
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
		const {active, changed} = this.state;
		const {availableBeginning: begin, availableEnding: end, disableText} = this.props;

		const trigger = <DayTimeToggleTrigger availableBeginning={begin} availableEnding={end} onChange={this.onClear} disableText={disableText}/>;

		const beginClassNames = cx('part beginning', {active: active === TOGGLE.BEGIN});
		const endClassNames = cx('part ending', {active: active === TOGGLE.END}, {disabled: !this.state[TOGGLE.BEGIN]});
		const btnClassNames = cx('flyout-fullwidth-btn', {changed: changed});

		return (
			<Flyout ref={this.setFlyoutRef} className="daytime-toggle" alignment="bottom-left" trigger={trigger} arrow>
				<div className="toggle">
					<div className={beginClassNames} name={TOGGLE.BEGIN} onClick={this.onToggle}>Begin Date</div>
					<div className={endClassNames} name={TOGGLE.END} onClick={this.onToggle}>Finish Date</div>
				</div>
				<DayTimePicker
					value={this.state[active]}
					onChange={this.onDateChange}
					disabledDays={this[active + 'Disabled']}
				/>
				<div className={btnClassNames} onClick={this.onSave}>Save</div>
			</Flyout>
		);
	}
}
