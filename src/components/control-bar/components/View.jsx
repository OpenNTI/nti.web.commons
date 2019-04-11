import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {TransitionGroup, CSSTransition} from 'react-transition-group';

import {MountToBody} from '../../../remote-mount';

const BODY_CLS = 'control-bar-open';

function getBody () {
	return typeof document === 'undefined' ? null : document.body;
}

export default class ControlBarView extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		visible: PropTypes.bool,
		children: PropTypes.node
	}


	constructor (props) {
		super(props);

		const {visible} = props;

		this.state = {
			visible
		};
	}


	componentDidUpdate (prevProps) {
		const {visible:nextVisible} = this.props;
		const {visible:currentVisible} = prevProps;

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
		const {children, className} = this.props;

		return (
			<MountToBody className={cx('nti-control-bar-mount', className)}>
				<TransitionGroup>
					{visible && (
						<CSSTransition key="control-bar" timeout={500}  classNames="slide-up">
							<div className="nti-control-bar">
								{children}
							</div>
						</CSSTransition>
					)}
				</TransitionGroup>
			</MountToBody>
		);
	}

}
