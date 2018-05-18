import React from 'react';
import PropTypes from 'prop-types';

import {getEffectiveScreenSize} from './utils';

export default class ResponsiveItem extends React.Component {
	static propTypes = {
		query: PropTypes.func.isRequired,

		component: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
		render: PropTypes.func,

		additionalArguments: PropTypes.object
	}

	state = {}

	constructor (props) {
		super(props);

		if (!props.component && !props.render) {
			throw new Error('Must have a component or render prop for a ResponsiveItem');
		}
	}

	componentDidMount () {
		this.setupFor(this.props);
	}


	componentDidUpdate (prevProps) {
		const {additionalArguments:oldArguments} = prevProps;
		const {additionalArguments:newArguments} = this.props;

		if (oldArguments !== newArguments) {
			this.setupFor(this.props);
		}
	}


	setupFor (props) {
		const {query, additionalArguments} = props;

		this.setState({
			visible: query({
				screenSize: getEffectiveScreenSize(),
				...additionalArguments
			})
		});
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
