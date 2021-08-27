import './Prompt.scss';
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Logger from '@nti/util-logger';
import { addClass } from '@nti/lib-dom';
import { rawContent, wait } from '@nti/lib-commons';

import DialogButtons from '../components/DialogButtons';

import Manager from './ModalManager';

const logger = Logger.get('common:prompts:Prompt');
const emptyFunction = () => {};

const MOUNT_POINT_CLS = 'nti-dialog-mount-point';

//XXX: Convert this to be an instance of 'Modal'...and go through the modal manager

export default class Prompt extends React.Component {
	static getMountPoint() {
		let mountPoint = document.querySelector(`.${MOUNT_POINT_CLS}`);

		if (!mountPoint) {
			mountPoint = document.createElement('div');
			addClass(mountPoint, MOUNT_POINT_CLS);

			document.body.appendChild(mountPoint);
		}

		return mountPoint;
	}

	static clear() {
		const mountPoint = this.getMountPoint();
		let res = ReactDOM.unmountComponentAtNode(mountPoint);

		if (res) {
			//only clear active if React unmounted the component at the mount point.
			this.active = null;
			document.body.removeChild(mountPoint);
		}

		return res;
	}

	static show(props) {
		if (this.active && this.active.dismiss) {
			this.active.dismiss();
		}

		try {
			ReactDOM.render(
				React.createElement(Prompt, {
					...props,
					ref: x => (this.active = x),
				}),
				this.getMountPoint()
			);
		} catch (e) {
			logger.error(e.stack || e.message || e);
		}
	}

	static propTypes = {
		iconClass: PropTypes.string,
		title: PropTypes.string,
		message: PropTypes.string,
		promptType: PropTypes.string,

		confirmButtonLabel: PropTypes.string,
		confirmButtonClass: PropTypes.string,

		cancelButtonLabel: PropTypes.string,
		cancelButtonClass: PropTypes.string,

		onCancel: PropTypes.func,
		onConfirm: PropTypes.func,
		onDismiss: PropTypes.func,
	};

	static defaultProps = {
		iconClass: 'alert',
		message: '...',
		title: 'Alert',
		promptType: 'alert',
		confirmButtonClass: 'primary',
		confirmButtonLabel: 'OK',
		cancelButtonClass: '',
		cancelButtonLabel: 'Cancel',
		onDismiss: emptyFunction,
	};

	attachConfirmRef = el => (this.confirm = el);
	attachFrameRef = el => (this.frame = el);

	constructor(props) {
		super(props);
		this.state = {
			dismissing: false,
			dismissCalled: false,
		};

		Manager.add(
			(this.modalRef = {
				refocus: document.activeElement,
				dismiss: () => this.dismiss(),
				component: this,
				mountPoint: Prompt.getMountPoint(),
			})
		);
	}

	componentDidMount() {
		this.mounted = true;
		window.addEventListener('popstate', this.dismiss);
	}

	componentDidUpdate() {
		let focusNode;
		if (this.mounted) {
			focusNode = this.confirm || this.cancel || this.frame;

			focusNode.focus();
		}
	}

	componentWillUnmount() {
		this.mounted = false;
		window.removeEventListener('popstate', this.dismiss);
		Manager.remove(this.modalRef);
		delete this.modalRef;
	}

	confirmClicked = async e => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		await dismiss(this);

		const { onConfirm } = this.props;
		if (onConfirm) {
			onConfirm.call();
		}
	};

	dismiss = async e => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		await dismiss(this);

		const { onCancel } = this.props;
		if (onCancel) {
			onCancel.call();
		}
	};

	focus = () => this.confirm && this.confirm.focus();

	render() {
		const {
			props: {
				iconClass,
				message,
				title,
				promptType,

				confirmButtonLabel,
				confirmButtonClass,

				cancelButtonLabel,
				cancelButtonClass,

				onCancel,
				onConfirm,
			},
			state: { dismissing },
		} = this;

		const state = dismissing ? 'dismissing' : 'showing';

		const buttons = [
			onCancel && {
				label: cancelButtonLabel,
				className: cancelButtonClass,
				onClick: this.dismiss,
				'data-testid': 'cancel',
			},
			onConfirm && {
				ref: this.attachConfirmRef,
				className: confirmButtonClass,
				label: confirmButtonLabel,
				onClick: this.confirmClicked,
				'data-testid': 'confirm',
			},
		].filter(x => x);

		return (
			<div
				data-testid="prompt-modal"
				ref={this.attachFrameRef}
				className={`modal dialog mask ${promptType} ${state}`}
			>
				<div className={`dialog window ${state}`}>
					{this.renderDismissControl()}
					<div className={`icon ${iconClass}`} />
					<div className="content-area">
						<h1 {...rawContent(title)} />
						<p {...rawContent(message)} />
					</div>
					<DialogButtons buttons={buttons} />
				</div>
			</div>
		);
	}

	renderDismissControl() {
		if (this.props.onCancel == null) {
			return null;
		}

		return (
			<a className="close" href="#dismiss" onClick={this.dismiss}>
				x
			</a>
		);
	}
}

async function dismiss(dialog) {
	dialog.props.onDismiss.call();
	dialog.setState({ dismissing: true, dismissCalled: true });

	//Wait for animation before we remove it. -- animation delay (500ms, or 0.5s)
	await wait(501);

	if (!Prompt.clear()) {
		logger.warn('React did not unmount %o', dialog);
	}
}
