import { useEffect, useState } from 'react';

import Clock from './Clock';

export function useClock(interval) {
	const [clock, setClock] = useState({
		running: false,
		current: 0,
		duration: -1,
	});

	useEffect(() => {
		const started = new Date();
		const onTick = newClock => {
			if (newClock.current - clock.current > interval) {
				setClock({
					...newClock,
					clockDuration: newClock.duration,
					duration: newClock.current - started,
				});
			}
		};

		Clock.addListener(onTick);

		return () => Clock.removeListener(onTick);
	}, [interval]);

	return clock;
}

export function useTicks(interval) {
	const clock = useClock(interval);

	const [ticks, setTicks] = useState(0);

	useEffect(() => {
		const newTicks = Math.floor(clock.duration / interval);

		if (newTicks !== ticks) {
			setTicks(newTicks);
		}
	}, [clock]);

	return ticks;
}

export function useWait(fn, interval) {
	useEffect(() => {
		const started = new Date();
		const onTick = tick => {
			if (tick.current - started >= interval) {
				fn();
				Clock.removeListener(onTick);
			}
		};

		Clock.addListener(onTick);

		return () => Clock.removeListener(onTick);
	}, [fn, interval]);
}
