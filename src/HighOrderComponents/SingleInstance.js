import React from 'react';

class ReferenceCounter {

	static counters = {};
	static instanceFor (Cmp) {
		return this.counters[Cmp] = this.counters[Cmp] || new this();
	}

	instances = []

	add = instance => {
		this.instances.push(instance);
	}

	remove = instance => {
		const index = this.instances.indexOf(instance);
		if (index > -1) {
			this.instances.splice(index, 1);
		}
		this.instances.forEach(i => i.forceUpdate());
	}

	shouldRender = instance => this.instances[0] === instance
}

/**
 * Decorator that ensures only a single instance of the given component is rendered into the DOM at a time.
 * @param {class} Cmp The React Component class
 * @returns {class} The decorated class
 */
export default function SingleInstanceDecorator (Cmp) {
	const counter = ReferenceCounter.instanceFor(Cmp);

	return class SingleInstance extends React.Component {
		constructor (props) {
			super(props);
			counter.add(this);
		}

		componentWillUnmount () {
			counter.remove(this);
		}

		render () {
			return (
				counter.shouldRender(this)
					? <Cmp {...this.props} />
					: null
			);
		}
	};
}
