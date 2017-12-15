import React from 'react';
import PropTypes from 'prop-types';

export default class ResponsiveItem extends React.Component {
	static propTypes = {
		query: PropTypes.func.isRequired,

		component: PropTypes.element,
		render: PropTypes.func
	}

	constructor (props) {
		super(props);

		if (!props.component && !props.render) {
			throw new Error('Must have a component or render prop for a ResponsiveItem');
		}

		this.state = this.getStateFor(props);
	}


	getStateFor (props = this.props) {
		const {query} = props;

		return {
			visible: query()
		};
	}


	render () {
		const {visible} = this.state;

		if (!visible) { return null; }

		const {component, render, ...otherProps} = this.props;

		delete otherProps.query;

		if (component) {
			return React.createElement(component, otherProps);
		}

		if (render) {
			return render(otherProps);
		}
	}
}
