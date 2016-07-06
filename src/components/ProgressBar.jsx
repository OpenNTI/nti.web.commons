import React, {PropTypes} from 'react';
import cx from 'classnames';
import Transition from 'react-addons-css-transition-group';

export default class ProgressBar extends React.Component {
	static propTypes = {
		value: PropTypes.number,
		max: PropTypes.number,
		text: PropTypes.string,
		onCancel: PropTypes.func,
		onDismiss: PropTypes.func
	}

	state = {}


	onCancel = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const {onCancel} = this.props;
		if (onCancel) {
			onCancel();
		}
	}

	onDismiss = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const {onDismiss} = this.props;
		if (onDismiss) {
			onDismiss();
		}
	}


	render () {
		const {
			max,
			onCancel: cancelable,
			text,
			value
		} = this.props;

		const complete = value >= max;
		const percent = Math.round((value / max) * 100);
		const timeleft = '';

		return (
			<Transition
				component="div"
				className={cx('progress-bar-component', {complete})}
				transitionName="progress-bar-transition"
				transitionEnterTimeout={300}
				transitionLeaveTimeout={300}
				>
				{complete ? (
					<div key="complete" className="complete">
						<i className="icon-check"/>
						{text}
						<a href="#" onClick={this.onDismiss}><i className="icon-remove small"/></a>
					</div>
				) : (
					<div className="in-progress" key="in-progress">
						<div className="progress-header">
							<span>
								{text}
								{cancelable && (<a href="#" onClick={this.onCancel}>Cancel</a>)}
							</span>
							<span className="time-left">
								{timeleft}
							</span>
						</div>

						<div>
							<progress max={max} value={value}>
								<div className="progress-bar-fallback">
									<span style={{width: `${percent}%`}}/>
								</div>
							</progress>
						</div>
					</div>
				)}
			</Transition>
		);
	}
}
