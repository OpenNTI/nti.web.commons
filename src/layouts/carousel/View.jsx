import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {TransitionGroup, CSSTransition} from 'react-transition-group';

import Timer from '../../timer';

const TRANSITION_TO_TIMEOUT = {
	'carousel-transition-rotate-up': 1000
};

export default class Carousel extends React.Component {
	static ROTATE_UP = 'carousel-transition-rotate-up'

	static propTypes = {
		className: PropTypes.string,
		children: PropTypes.any,
		active: PropTypes.number,
		transition: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),
		interval: PropTypes.number,
		wrap: PropTypes.bool
	}

	state = {}

	componentDidMount () {
		this.setupFor(this.props);
	}


	componentDidUpdate (prevProps) {
		const {active} = this.props;
		const {active:prevActive} = prevProps;

		if (prevActive !== active) {
			this.setupFor(this.props);
		}
	}


	setupFor (props) {
		const {active} = props;

		this.setState({active});
	}


	onTick = () => {
		const {children, wrap} = this.props;
		const total = React.Children.count(children);
		const {active} = this.state;

		let next = active + 1;

		if (next >= total) {
			next = wrap ? 0 : active;
		}

		this.setState({
			active: next
		});
	}


	render () {
		const {className, transition, interval} = this.props;

		return (
			<div className={cx('nti-layouts-carousel', className, {'has-transition': !!transition})}>
				{interval && (<Timer interval={interval} onTick={this.onTick} />)}
				{transition && this.renderTransition()}
				{!transition && this.renderActiveChild()}
			</div>
		);
	}


	renderTransition () {
		const {transition} = this.props;
		const {active} = this.state;

		let transitionProps;

		if (typeof transition === 'string') {
			transitionProps = {
				classNames: transition,
				timeout: TRANSITION_TO_TIMEOUT[transition]
			};
		} else {
			transitionProps = transition;
		}

		return (
			<TransitionGroup className="nti-layouts-carousel-transition">
				<CSSTransition {...transitionProps} key={active}>
					{this.renderActiveChild()}
				</CSSTransition>
			</TransitionGroup>
		);
	}


	renderActiveChild () {
		const {children} = this.props;
		const {active} = this.state;

		const childrenList = React.Children.toArray(children);

		return childrenList[active || 0];
	}
}
