import React from 'react';
import PropTypes from 'prop-types';
import {HOC} from 'nti-commons';

export default class BasePath extends React.Component {

	static connect (Component) {

		const cmp = class ItemChangesWrapper extends React.Component {
			render () {
				return (
					<BasePath _component={Component} {...this.props}/>
				);
			}
		};

		cmp.WrappedComponent = Component.WrappedComponent || Component;

		return HOC.hoistStatics(cmp, Component, 'BasePathProvider');
	}

	static propTypes = {
		_component: PropTypes.any,
		children: PropTypes.node
	}

	static contextTypes = {
		basePath: PropTypes.string.isRequired
	}

	render () {
		const {children, _component, ...props} = this.props;

		Object.assign(props, this.context);

		return _component
			? React.createElement(_component, props)
			: React.cloneElement(React.Children.only(children), props);
	}
}
