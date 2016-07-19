import React from 'react';
import ReactDOM from 'react-dom';
import Dialog from './components/Dialog';
import Modal from './components/Modal';

export function alert (message, title = 'Alert', extra = {}) {
	return new Promise(acknowledge=> {
		Dialog.show(Object.assign({
			confirmButtonClass: 'caution',
			iconClass: 'caution',
			message, title,
			onConfirm: ()=> acknowledge()
		}, extra || {}));
	});
}

export function areYouSure (message, title = 'Are you sure?', extra = {}) {
	return new Promise((acknowledge, cancel)=> {
		Dialog.show(Object.assign({
			confirmButtonClass: 'caution',
			iconClass: 'caution',
			message, title,
			onConfirm: ()=> acknowledge(),
			onCancel: ()=> cancel('Prompt Canceled')
		}, extra || {}));
	});
}

export function modal (content, className, handlers = {}) {

	const {createElement: ce} = global.document || {};
	const makeDOM = o => ce && Object.assign(ce.call(document, o.tag || 'div'), o);

	const container = makeDOM({className: 'modal'});
	document.body.appendChild(container);

	function dismiss () {
		if (handlers.onBeforeDismiss && !handlers.onBeforeDismiss()) {
			return;
		}
		ReactDOM.unmountComponentAtNode(container);
		document.body.removeChild(container);
	}

	ReactDOM.render(
		<Modal onDismiss={dismiss} className={className}>{content}</Modal>,
		container
	);

}
