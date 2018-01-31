import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import isIOS from 'nti-util-ios-version';
import { declareCustomElement } from 'nti-lib-dom';

import LockScroll from '../../components/LockScroll';
import Manager from '../ModalManager';

declareCustomElement('dialog');


const needsSafariFix = e => e && (isIOS() && /input|textarea|select/i.test(e.target.tagName));
const stopEvent = e => e.stopPropagation();

export default class Modal extends React.Component {

	static propTypes = {
		onDismiss: PropTypes.func.isRequired,
		children: PropTypes.node,
		className: PropTypes.string,
		closeOnMaskClick: PropTypes.bool,
		isPortal: PropTypes.bool,//sent by ModalManager
		tall: PropTypes.bool
	}


	static childContextTypes = {
		close: PropTypes.func
	}

	attachContentRef = x => this.content = x

	getChildContext = () => ({
		close: this.close
	})


	state = {}


	componentDidMount () {
		Manager.addUpdateListener(this.onManagerUpdate);
		this.focus();
	}


	componentWillUnmount () {
		Manager.removeUpdateListener(this.onManagerUpdate);
	}


	onManagerUpdate = () => !this.props.isPortal && this.forceUpdate()


	close = (e) => {
		const {onDismiss} = this.props;
		if (e) {
			e.stopPropagation();
		}
		if (onDismiss) {
			onDismiss(e);
		}
	}


	focus = () => {
		this.content.focus();
	}


	onMaskClick = (e) => {
		const {closeOnMaskClick} = this.props;
		if (closeOnMaskClick) {
			this.close(e);
		}
	}


	onFocus = (e) => {
		if (needsSafariFix(e)) {
			this.setState({safariFix: true});
		}
	}


	onBlur = (e) => {
		if (needsSafariFix(e)) {
			this.setState({safariFix: false});
		}
	}


	render () {
		const {children, className, tall} = this.props;
		const {safariFix} = this.state;
		const hidden = Manager.isHidden(this);

		const classes = cx('modal-mask', className, {hidden, 'safari-fix': safariFix, tall});

		const ios = isIOS();
		const timeout = 500;
		//Fragment will be undefined on react 15.
		const Wrapper = Fragment || 'div';

		return (
			<Wrapper>
				<LockScroll />
				<TransitionGroup>
					<CSSTransition
						key={className}
						classNames="modal-mask"
						timeout={timeout}
						appear={!ios}
						enter={!ios}
						exit={!ios}
					>
						<div
							className={classes}
							onFocus={this.onFocus}
							onBlur={this.onBlur}
							onClick={this.onMaskClick}
						>
							<i className="icon-close" onClick={this.close}/>
							<dialog role="dialog" className="modal-content" open ref={this.attachContentRef} tabIndex="-1" onClick={stopEvent}>
								{React.cloneElement(
									React.Children.only(children),
									{ onDismiss: this.close }
								)}
							</dialog>
						</div>
					</CSSTransition>
				</TransitionGroup>
			</Wrapper>
		);
	}

}
