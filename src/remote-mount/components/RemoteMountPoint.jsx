import React from 'react';
import {createMountPoint} from '../utils';

class RemoteWrapper extends React.Component {
	static propTypes = {
		children: React.PropTypes.node
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
		appendTo: React.PropTypes.shape({
			appendChild: React.PropTypes.func
		}).isRequired,
		className: React.PropTypes.string,
		children: React.PropTypes.node
	}


	componentDidMount () {
		const {className, appendTo, children} = this.props;

		this.mountPoint = createMountPoint(appendTo, className);

		this.mountPoint.render(RemoteWrapper, {}, children);
	}


	componentWillUnmount () {
		if (this.mountPoint) {
			this.mountPoint.remove();
			delete this.mountPoint;
		}
	}


	componentDidUpdate () {
		const {children} = this.props;

		if (this.mountPoint) {
			this.mountPoint.render(RemoteWrapper, {}, children);
		}
	}


	render () {
		return (
			<span data-placeholder="mount point placeholder"/>
		);
	}
}


//TODO: add a function to take content and render it, with out going through the high order component
