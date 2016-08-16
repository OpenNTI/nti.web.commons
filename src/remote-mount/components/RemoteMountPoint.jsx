import React from 'react';
import {createMountPoint} from '../utils';

RemoteWrapper.propTypes = {
	children: React.PropTypes.node
};

function RemoteWrapper ({children}) {
	const child = React.Children.only(children);

	return child;
}

export default class MountPoint extends React.Component {
	static propTypes = {
		appendTo: React.PropTypes.shape({
			appendChild: React.PropTypes.func
		}),
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
		}
	}


	render () {
		return (
			<span data-placeholder="mount point placeholder"></span>
		);
	}
}
