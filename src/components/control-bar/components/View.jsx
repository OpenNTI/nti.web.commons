import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {MountToBody} from '../../../remote-mount';

const BODY_CLS = 'control-bar-open';

function getBody () {
	return typeof document === 'undefined' ? null : document.body;
}

export default class ControlBarView extends React.Component {
	static propTypes = {
		visible: React.PropTypes.bool,
		children: React.PropTypes.node
	}


	constructor (props) {
		super(props);

		const {visible} = props;

		this.state = {
			visible
		};
	}


	componentWillReceiveProps (nextProps) {
		const {visible:nextVisible} = nextProps;
		const {visible:currentVisible} = this.props;

		if (currentVisible !== nextVisible) {
			this.setState({
				visible: nextVisible
			}, () => {
				if (this.updateBodyClass) {
					this.updateBodyClass();
				}
			});
		}
	}


	componentDidMount () {
		this.updateBodyClass = () => {
			const {visible} = this.state;

			if (visible) {
				this.addBodyClass();
			} else {
				this.removeBodyClass();
			}
		};

		this.updateBodyClass();
	}


	componentWillUnmount () {
		this.removeBodyClass();
	}


	addBodyClass () {
		const body = getBody();

		if (body) {
			body.classList.add(BODY_CLS);
		}
	}


	removeBodyClass () {
		const body = getBody();

		if (body) {
			body.classList.remove(BODY_CLS);
		}
	}


	render () {
		const {visible} = this.state;
		const {children} = this.props;

		return (
			<MountToBody className="nti-control-bar-mount">
				<ReactCSSTransitionGroup transitionName="slideUp" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
					{visible && (
						<div key="control-bar" className="nti-control-bar">
							{children}
						</div>
					)}
				</ReactCSSTransitionGroup>
			</MountToBody>
		);
	}

}
