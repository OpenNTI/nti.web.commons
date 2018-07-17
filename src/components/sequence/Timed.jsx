import React from 'react';
import PropTypes from 'prop-types';

const DEFAULT_TIME = 3000;//3 seconds

const UPDATE_TIMEOUT = Symbol('Update Timeout');

export default class TimedSequence extends React.Component {
	static propTypes = {
		children: PropTypes.any,
		defaultShowFor: PropTypes.number,
		onFinish: PropTypes.func
	}


	static defaultProps = {
		defaultTime: DEFAULT_TIME
	}

	state = {}

	constructor (props) {
		super(props);
		this.setUpChildren();
	}


	componentDidUpdate (prevProps) {
		const {children:newChildren} = this.props;
		const {children:oldChildren} = prevProps;

		if (newChildren !== oldChildren) {
			this.setUpChildren();
		}
	}


	componentDidMount () {
		this.startTimer();
	}


	componentWillUnmount () {
		this.stopTimer();
	}


	setUpChildren (props = this.props) {
		const {children:reactChildren, defaultShowFor} = props;
		const children = React.Children.toArray(reactChildren);

		const childrenState = children.reduce((acc, child) => {
			acc.push({
				showFor: (child.props && child.props.showFor) || defaultShowFor,
				cmp: child
			});

			return acc;
		}, []);

		this.setState({
			childrenState,
			current: -1
		}, () => {
			if (this.running) {
				this.stopTimer();
				this.startTimer();
			}
		});
	}


	onSequenceFinish = () => {
		const {onFinish} = this.props;

		if (onFinish) {
			onFinish();
		}
	}


	onTick (current = 0) {
		const {childrenState} = this.state;
		const next = current + 1;

		if (!this.running) { return; }

		this.setState({
			current: next
		}, () => {
			const child = childrenState[next];

			if (child && child.showFor < Infinity) {
				this[UPDATE_TIMEOUT] = setTimeout(() => this.onTick(next), child.showFor);
			}

			if (!child) {
				this.onSequenceFinish();
			}
		});
	}


	startTimer () {
		if (!this.running) {
			this.running = true;
			this.onTick(-1);
		}
	}


	stopTimer () {
		delete this.running;
		clearTimeout(this[UPDATE_TIMEOUT]);
	}


	render () {
		const {childrenState, current} = this.state;
		const child = childrenState[current];
		const cmp = (child && child.cmp) || null;

		return cmp;
	}
}
