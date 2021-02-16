import EventEmitter from 'events';

import { Events } from '@nti/lib-commons';
import { getViewportHeight, getScrollParent } from '@nti/lib-dom';

const BUS = new EventEmitter();
const GROUP_TO_STORE = {};

const GROUP = Symbol('Group');
const ORDERED_COMPONENTS = Symbol('Ordered Component');
const TRACKED_COMPONENTS = Symbol('Tracked Components');

const getEventForGroup = group => `${group}-tracked-components-change`;

function onGroupChange(group, order) {
	const event = getEventForGroup(group);

	BUS.emit(event, order);
}

function onGroupEmptied(group) {
	setTimeout(() => {
		const store = GROUP_TO_STORE[group];

		if (!store.hasTracked) {
			delete GROUP_TO_STORE[group];
		}
	}, 60000);
}

function componentsDidChange(a, b) {
	if (a.length !== b.length) {
		return true;
	}

	for (let i = 0; i < a.length; i++) {
		if (a[i].node !== b[i].node || a[i].data !== b[i].data) {
			return true;
		}
	}

	return false;
}

export default class VisibleComponentTrackerStore {
	static getInstanceFor(group) {
		if (!GROUP_TO_STORE[group]) {
			GROUP_TO_STORE[group] = new VisibleComponentTrackerStore(group);
		}

		return GROUP_TO_STORE[group];
	}

	static addGroupListener(group, fn) {
		const store = GROUP_TO_STORE[group];
		const event = getEventForGroup(group);

		BUS.addListener(event, fn);

		if (store) {
			fn(store.components);
		}
	}

	static removeGroupListener(group, fn) {
		const event = getEventForGroup(group);

		BUS.removeListener(event, fn);
	}

	constructor(group) {
		this[GROUP] = group;
		this[ORDERED_COMPONENTS] = [];
		this[TRACKED_COMPONENTS] = new Set([]);
	}

	get components() {
		return this[ORDERED_COMPONENTS];
	}

	hasTracked() {
		if (this[TRACKED_COMPONENTS].size > 0) {
			return true;
		}

		return false;
	}

	track(cmp, group) {
		const hadTracked = this.hasTracked();

		this[TRACKED_COMPONENTS].add(cmp);

		clearTimeout(this.recomputeOnTrackTimeout);
		this.recomputeOnTrackTimeout = setTimeout(() => this.onScroll(), 100);

		if (!hadTracked) {
			this.startListening();
		}
	}

	untrack(cmp, group) {
		this[TRACKED_COMPONENTS].delete(cmp);

		clearTimeout(this.recomputeOnUntrackTimeout);
		this.recomputeOnUntrackTimeout = setTimeout(() => this.onScroll(), 100);

		if (!this.hasTracked()) {
			this.stopListening();
			onGroupEmptied(this[GROUP]);
		}
	}

	onScroll = () => {
		const viewportHeight = getViewportHeight();
		const components = Array.from(this[TRACKED_COMPONENTS])
			.map(cmp => ({ node: cmp.node, data: cmp.data }))
			.filter(cmp => {
				if (!cmp.node) {
					return false;
				} //filter out any components that don't have a node yet

				const rect = cmp.node.getBoundingClientRect();

				if (rect.bottom <= 0) {
					return false;
				}
				if (rect.top > viewportHeight) {
					return false;
				}

				return true;
			})
			.sort((a, b) => {
				const aRect = a.node.getBoundingClientRect();
				const bRect = b.node.getBoundingClientRect();

				return aRect.top - bRect.top;
			});

		if (componentsDidChange(components, this[ORDERED_COMPONENTS])) {
			this[ORDERED_COMPONENTS] = components;
			onGroupChange(this[GROUP], components);
		}
	};

	startListening() {
		const scrollingElement = (this.scrollingElement =
			this.scrollingElement || getScrollParent());

		if (!scrollingElement) {
			return;
		}

		this.stopListening();

		if (Events.supportsPassive()) {
			scrollingElement.addEventListener('scroll', this.onScroll, {
				passive: true,
			});
		} else {
			scrollingElement.addEventListener('scroll', this.onScroll);
		}
	}

	stopListening() {
		const scrollingElement = (this.scrollingElement =
			this.scrollingElement || getScrollParent());

		if (!scrollingElement) {
			return;
		}

		if (Events.supportsPassive()) {
			scrollingElement.removeEventListener('scroll', this.onScroll, {
				passive: true,
			});
		} else {
			scrollingElement.removeEventListener('scroll', this.onScroll);
		}
	}
}
