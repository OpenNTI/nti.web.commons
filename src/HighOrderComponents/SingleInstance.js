import React from 'react';

const counts = {};

/**
 * Decorator that ensures only a single instance of the given component is rendered into the DOM at a time.
 * @param {class} Cmp The React Component class
 * @returns {class} The decorated class
 */
export default function SingleInstanceDecorator (Cmp) {
	return class SingleInstance extends React.Component {
		constructor (props) {
			super(props);
			counts[Cmp] = (counts[Cmp] || 0) + 1;
		}

		componentWillUnmount () {
			counts[Cmp]--;
		}

		render () {
			return (
				counts[Cmp] > 1
					? null
					: <Cmp {...this.props} />
			);
		}
	};
}
