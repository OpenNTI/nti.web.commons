import {VisibilityMonitor} from '@nti/lib-dom';


const LISTENERS = Symbol('listeners');
const START = Symbol('start');
const STOP = Symbol('stop');
const ON_TICK = Symbol('on-tick');
const EMIT = Symbol('emit');
const STATE = Symbol('state');

const INTERVAL = 1000;

async function callListener (listener, state) {
	try {
		listener(state);
	} catch (e) {
		//swallow
	}
}

class Clock {
	constructor () {
		this[LISTENERS] = new Set([]);
		this[STATE] = {};
	}

	hasListeners () {
		return this[LISTENERS].size > 0;
	}

	addListener (fn) {
		const hadListeners = this.hasListeners();

		this[LISTENERS].add(fn);

		if (!hadListeners && this.hasListeners()) {
			this[START]();
		}
	}

	removeListener (fn) {
		this[LISTENERS].delete(fn);

		if (!this.hasListeners()) {
			this[STOP]();
		}
	}


	[EMIT] () {
		const listeners = Array.from(this[LISTENERS]);

		for (let listener of listeners) {
			callListener(listener, this[STATE]);
		}
	}


	[ON_TICK] () {
		if (!this[STATE].running || this[STATE].paused) { return; }

		const now = new Date();

		this[STATE].current = now;
		this[STATE].duration = now - this[STATE].started;
		this[EMIT]();


		setTimeout(() => this[ON_TICK](), INTERVAL);
	}


	[START] () {
		if (this[STATE].running) { return; }

		const now = new Date();

		this[STATE].running = true;
		this[STATE].started = now;

		this[ON_TICK]();

		VisibilityMonitor.addChangeListener(this.onVisibilityChange);
	}


	[STOP] () {
		if (!this[STATE].running) { return; }

		this[STATE] = {};
		this[STATE].running = false;
		VisibilityMonitor.removeChangeListener(this.onVisibilityChange);
	}


	onVisibilityChange = (visible) => {
		if (!visible) {
			this[STATE].paused = true;
		} else if (visible && this[STATE].paused) {
			this[STATE].paused = false;
			this[ON_TICK]();
		}
	}
}

export default new Clock();
