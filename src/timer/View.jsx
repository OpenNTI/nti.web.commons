import React from 'react';
import PropTypes from 'prop-types';

import Clock from './Clock';
import { SECOND, MINUTE } from './Constants';
import { useClock, useTicks, useWait } from './Hooks';

export default class Timer extends React.Component {
	static Clock = Clock;

	static Second = SECOND;
	static Minute = MINUTE;

	static useClock = useClock;
	static useTicks = useTicks;
	static useWait = useWait;

	static propTypes = {
		interval: PropTypes.number.isRequired,
		children: PropTypes.node,
		onTick: PropTypes.func,
	};

	static defaultProps = {
		interval: SECOND,
	};

	state = { ticks: 0 };

	componentDidMount() {
		Clock.addListener(this.onTick);
	}

	componentWillUnmount() {
		Clock.removeListener(this.onTick);
	}

	onTick = clock => {
		const { duration } = clock;
		const { interval, onTick } = this.props;
		const { ticks: oldTicks } = this.state;
		const newTicks = Math.floor(duration / interval);

		if (newTicks !== oldTicks) {
			if (onTick) {
				onTick(clock);
			}

			this.setState({
				ticks: newTicks,
				clock,
			});
		}
	};

	render() {
		const { children } = this.props;

		if (!children) {
			return null;
		}

		const { ticks, clock } = this.state;
		const child = React.Children.only(children);

		return React.cloneElement(child, { ticks, clock });
	}
}
