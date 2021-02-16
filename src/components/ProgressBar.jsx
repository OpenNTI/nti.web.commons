import './ProgressBar.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const Transition = props => (
	<CSSTransition
		classNames="progress-bar-transition"
		timeout={300}
		{...props}
	/>
);

export default class ProgressBar extends React.Component {
	static propTypes = {
		value: PropTypes.number,
		max: PropTypes.number,
		text: PropTypes.string,
		onCancel: PropTypes.func,
		onDismiss: PropTypes.func,
	};

	state = {};

	constructor(props) {
		super(props);
		this.mounted = new Date();
		setTimeout(() => this.forceUpdate(), 1001);
	}

	onCancel = e => {
		e.preventDefault();
		e.stopPropagation();
		const { onCancel } = this.props;
		if (onCancel) {
			onCancel();
		}
	};

	onDismiss = e => {
		e.preventDefault();
		e.stopPropagation();
		const { onDismiss } = this.props;
		if (onDismiss) {
			onDismiss();
		}
	};

	render() {
		const { max, onCancel: cancelable, text, value } = this.props;

		const mountTime = new Date() - this.mounted;

		const complete = value >= max && mountTime > 1000;
		const percent =
			Math.round((value / (max || 1)) * 100) || (value === max ? 100 : 0);
		const timeleft = '';

		return (
			<TransitionGroup
				className={cx('progress-bar-component', { complete })}
			>
				{complete ? (
					<Transition key="complete">
						<div className="complete">
							<i className="icon-check" />
							<span className="status-message">{text}</span>
							<a href="#" onClick={this.onDismiss}>
								<i className="icon-remove small" />
							</a>
						</div>
					</Transition>
				) : (
					<Transition key="in-progress">
						<div className="in-progress">
							<div className="progress-header">
								<span>
									<span className="status-message">
										{text}
									</span>
									{cancelable && (
										<a href="#" onClick={this.onCancel}>
											Cancel
										</a>
									)}
								</span>
								<span className="time-left">{timeleft}</span>
							</div>

							<div>
								<progress max={max} value={value}>
									<div className="progress-bar-fallback">
										<span
											style={{ width: `${percent}%` }}
										/>
									</div>
								</progress>
							</div>
						</div>
					</Transition>
				)}
			</TransitionGroup>
		);
	}
}
