import EventEmitter from 'events';

import React from 'react';

const ID_CHANGED = 'active-id-changed';

class ReferenceCounter extends EventEmitter {
	static counters = {};
	static instanceFor(Cmp) {
		return (this.counters[Cmp] = this.counters[Cmp] || new this());
	}

	ids = [];
	nextId = 1;

	subscribe = cb => {
		const unsub = () => this.removeListener(ID_CHANGED, cb);
		unsub(); // prevent multiple for the same listener. shouldn't be necessary, but safe > sorry.
		this.addListener(ID_CHANGED, cb);
		return unsub;
	};

	add = () => {
		const id = this.newId();
		this.ids.push(id);
		const shouldRender = this.ids[0] === id;
		return { id, shouldRender };
	};

	remove = id => {
		const index = this.ids.indexOf(id);
		if (index > -1) {
			this.ids.splice(index, 1);
		}
		if (index === 0 && this.ids.length > 0) {
			this.emit(ID_CHANGED, this.ids[0]);
		}
	};

	newId = () => this.nextId++;
}

/**
 * Decorator that ensures only a single instance of the given component is rendered into the DOM at a time.
 *
 * @param {class} Cmp The React Component class
 * @returns {class} The decorated class
 */
export default function SingleInstanceDecorator(Cmp) {
	const counter = ReferenceCounter.instanceFor(Cmp);

	return class SingleInstance extends React.Component {
		constructor(props) {
			super(props);
			this.unsubscribe = counter.subscribe(this.onActiveIdChange);
			this.state = counter.add();
		}

		componentWillUnmount() {
			const { id } = this.state;

			if (this.unsubscribe) {
				this.unsubscribe();
				delete this.unsubscribe;
			}
			counter.remove(id);
		}

		onActiveIdChange = id =>
			this.setState({ shouldRender: id === this.state.id });

		render() {
			const { shouldRender } = this.state;

			return shouldRender ? <Cmp {...this.props} /> : null;
		}
	};
}
