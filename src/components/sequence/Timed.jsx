import React from 'react';

const DEFAULT_TIME = 3000;//3 seconds

const UPDATE_TIMEOUT = Symbol('Update Timeout');

export default class TimedSequence extends React.Component {
	static propTypes = {
		children: React.PropTypes.any,
		defaultShowFor: React.PropTypes.number,
		onFinish: React.PropTypes.func
	}


	static defaultProps = {
		defaultTime: DEFAULT_TIME
	}

	state = {}

	componentWillMount () {
		this.setUpChildren();
	}


	componentWillReceiveProps (nextProps) {
		const {children:nextChildren} = nextProps;
		const {children:currentChildren} = this.props;

		if (nextChildren !== currentChildren) {
			this.setUpChildren(nextProps);
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
			this.onTick(-1);
		}

		this.running = true;
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
