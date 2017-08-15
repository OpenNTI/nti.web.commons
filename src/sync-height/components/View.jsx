import React from 'react';
import PropTypes from 'prop-types';

import HeightMonitor from './HeightMonitor';

export default class SyncHeightView extends React.Component {
	static propTypes = {
		group: PropTypes.shape({
			getNewItem: PropTypes.func.isRequired,
			setHeightFor: PropTypes.func.isRequired,
			addListener: PropTypes.func.isRequired,
			removeListener: PropTypes.func.isRequired,
			height: PropTypes.number.isRequired
		}).isRequired,
		children: PropTypes.node
	}

	attachHeightMonitorRef = x => this.heightMonitor = x


	constructor (props) {
		super(props);

		this.state = this.getStateForGroup(props);
	}


	componentWillReceiveProps (nextProps) {
		const {group:newGroup} = nextProps;
		const {group:oldGroup} = this.props;

		if (newGroup !== oldGroup) {
			this.addListener(nextProps);
			this.updateHeight();
			this.setState(this.getStateForGroup(nextProps));
		}
	}

	componentDidMount () {
		this.addListeners();
	}


	componentWillUnmount () {
		this.removeListeners();
	}


	getStateForGroup (props = this.props) {
		const {group} = props;

		return {
			item: group.getNewItem(),
			height: group.height
		};
	}


	addListener (props = this.props) {
		this.removeListener();

		const {group} = props;

		group.addListener('sync-height', this.syncHeight);
	}


	removeListener (props = this.props) {
		const {group} = props;

		group.removeListener('sync-height', this.syncHeight);
	}


	syncHeight = () => {
		const {height:newHeight} = this.props.group;
		const {height:oldHeight} = this.state;

		if (newHeight !== oldHeight) {
			this.setState({
				height: newHeight
			});
		}
	}


	updateHeight = () => {
		const {group} = this.props;
		const height = this.heightMonitor && this.heightMonitor.height;

		if (height != null && group) {
			group.setHeightFor(this.item, height);
		}
	}


	render () {
		const {children, ...otherProps} = this.props;
		const {height} = this.state;

		delete otherProps.group;

		//TODO: maybe don't stomp on inline styles
		return (
			<div {...otherProps} style={{minHeight: `${height}px`}}>
				<HeightMonitor ref={this.attachHeightMonitorRef} onChange={this.updateHeight}>
					{children}
				</HeightMonitor>
			</div>
		);
	}
}
