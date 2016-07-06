import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Logger from 'nti-util-logger';

import DialogButtons from '../../components/DialogButtons';

const logger = Logger.get('prompts:components:Dialog');
const emptyFunction = () => {};

export default class Dialog extends React.Component {

	static getMountPoint () {
		return document.getElementById('modals');
	}


	static clear () {
		let res = ReactDOM.unmountComponentAtNode(this.getMountPoint());
		if (res) {//only clear active if React unmounted the component at the mount point.
			this.active = null;
		}
		return res;
	}


	static show (props) {
		if (this.active) {
			this.active.dismiss();
		}

		try {
			this.active = ReactDOM.render(
				React.createElement(Dialog, props),
				this.getMountPoint());
		}
		catch (e) {
			logger.error(e.stack || e.message || e);
		}

	}


	static propTypes = {
		iconClass: PropTypes.string,
		title: PropTypes.string,
		message: PropTypes.string,

		confirmButtonLabel: PropTypes.string,
		confirmButtonClass: PropTypes.string,

		cancelButtonLabel: PropTypes.string,
		cancelButtonClass: PropTypes.string,

		onCancel: PropTypes.func,
		onConfirm: PropTypes.func,
		onDismiss: PropTypes.func
	}


	static defaultProps = {
		iconClass: 'alert',
		message: '...',
		title: 'Alert',
		confirmButtonClass: 'primary',
		confirmButtonLabel: 'OK',
		cancelButtonClass: '',
		cancelButtonLabel: 'Cancel',
		onDismiss: emptyFunction
	}


	constructor (props) {
		super(props);
		this.state = {
			dismissing: false,
			dismissCalled: false
		};


		this.handleEscapeKey = this.handleEscapeKey.bind(this);
		this.confirmClicked = this.confirmClicked.bind(this);
		this.dismiss = this.dismiss.bind(this);
	}


	componentDidMount () {
		this.mounted = true;
		window.addEventListener('popstate', this.dismiss);
	}


	componentDidUpdate () {
		let focusNode;
		if (this.mounted) {

			focusNode = this.confirm || this.cancel || this.frame;

			focusNode.focus();
		}
	}


	componentWillUnmount () {
		this.mounted = false;
		window.removeEventListener('popstate', this.dismiss);
	}


	handleEscapeKey (e) {
		if (e.key === 'Escape') {
			this.dismiss();
		}
	}


	confirmClicked (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		dismiss(this);

		const {onConfirm} = this.props;
		if (onConfirm) {
			onConfirm.call();
		}
	}


	dismiss (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		dismiss(this);

		const {onCancel} = this.props;
		if (onCancel) {
			onCancel.call();
		}
	}


	render () {
		const {
			props: {
				iconClass,
				message,
				title,

				confirmButtonLabel,
				confirmButtonClass,

				cancelButtonLabel,
				cancelButtonClass,

				onCancel,
				onConfirm
			},
			state: {
				dismissing
			}
		} = this;

		const state = dismissing ? 'dismissing' : 'showing';

		const buttons = [
			onCancel && {
				label: cancelButtonLabel,
				className: cancelButtonClass,
				onClick: this.dismiss
			},
			onConfirm && {
				className: confirmButtonClass,
				label: confirmButtonLabel,
				onClick: this.confirmClicked
			}
		].filter(x => x);

		return (
			<div ref={el => this.frame = el} className={`modal dialog mask ${state}`} onKeyDown={this.handleEscapeKey}>

				<div className={`dialog window ${state}`}>
					{this.renderDismissControl()}
					<div className={`icon ${iconClass}`}/>
					<div className="content-area">
						<h1>{title}</h1>
						<p>{message}</p>
					</div>
					<DialogButtons buttons={buttons} />
				</div>

			</div>
		);
	}


	renderDismissControl () {
		if (this.props.onCancel == null) {
			return null;
		}

		return (
			<a className="close" href="#dismiss" onClick={this.dismiss}>x</a>
		);
	}

}



function dismiss (dialog) {
	dialog.props.onDismiss.call();
	dialog.setState({dismissing: true, dismissCalled: true});

	//Wait for animation before we remove it.
	setTimeout(
		()=> {
			if (!Dialog.clear()) {
				logger.warn('React did not unmount %o', dialog);
			}
		},
		500//animation delay (0.5s)
	);
}
