import React from 'react';
import PropTypes from 'prop-types';

import Store from './Store';

export default class VisibleComponentTracker extends React.Component {
	static addGroupListener (group, fn) {
		return Store.addGroupListener(group, fn);
	}


	static removeGroupListener (group, fn) {
		return Store.removeGroupListener(group, fn);
	}


	static propTypes = {
		group: PropTypes.string,
		data: PropTypes.any
	}

	state = {};

	attachRef = (node) => {
		const {store} = this.state;
		const oldNode = this.domNode;

		this.domNode = node;

		if (!store) { return; }

		if (node) {
			store.track(this);
		} else if (oldNode) {
			store.untrack(this);
		}
	}


	constructor (props) {
		super(props);

		const {group} = props;

		this.state = {
			store: Store.getInstanceFor(group)
		};
	}


	get node () {
		return this.domNode;
	}


	get data () {
		return this.props.data;
	}


	componentDidUpdate (prevProps) {
		const {group} = this.props;
		const {group:prevGroup} = prevProps;

		if (group !== prevGroup) {
			this.setupFor(this.props);
		}
	}


	setupFor (props = this.props) {
		const {group} = props;
		const {store} = this.state;
		const newStore = Store.getInstanceFor(group);

		if (store === newStore) { return; }

		if (store) {
			store.untrack(this);
		}

		this.setState({
			store: newStore
		});

		if (this.domNode) {
			newStore.track(this.domNode);
		}
	}


	render () {
		const {group, ...props} = this.props;

		delete props.onInView;
		delete props.onOutOfView;

		return (
			<div ref={this.attachRef} data-tracking-group={group} {...props} />
		);
	}
}
