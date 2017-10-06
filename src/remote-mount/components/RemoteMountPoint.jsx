import React from 'react';
import PropTypes from 'prop-types';

import {createMountPoint} from '../utils';

class RemoteWrapper extends React.Component {
	static propTypes = {
		children: PropTypes.node
	}

	render () {
		return React.Children.only(this.props.children);
	}
}

/**
 * This high order component should only be used as LAST RESORT. It renders its children in a div
 * that is appended to the body instead of inline where it should be. We should just use this for
 * items that will be fixed and need to be on top of the page. By appending it to the body we don't
 * have to get into z-index messes. We can rely the position in the dom to determine the z order.
 */
export default class RemoteMountPoint extends React.Component {
	static propTypes = {
		appendTo: PropTypes.shape({
			appendChild: PropTypes.func
		}).isRequired,
		className: PropTypes.string,
		children: PropTypes.node
	}


	componentWillMount () {
		const {className, appendTo} = this.props;
		this.mountPoint = createMountPoint(appendTo, className);
	}

	componentDidMount () {
		this.renderNonPortal();
	}


	componentWillUnmount () {
		if (this.mountPoint) {
			this.mountPoint.remove();
			delete this.mountPoint;
		}
	}


	componentDidUpdate () {
		this.renderNonPortal();
	}


	renderNonPortal () {
		const {props: {children}, mountPoint: m} = this;
		if (m && !m.isPortal) {
			m.render(RemoteWrapper, {}, children);
		}
	}

	render () {
		const {props: {children}, mountPoint: m} = this;
		const {mountPoint: m} = this;
		return m.isPortal ? m.render(RemoteWrapper, {}, children) : (
			<span data-placeholder="mount point placeholder"/>
		);
	}
}


//TODO: add a function to take content and render it, with out going through the high order component
