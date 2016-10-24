import React from 'react';
import ReactDOM from 'react-dom';
import Dialog from './components/Dialog';
import Modal from './components/Modal';

export function alert (message, title = 'Alert', extra = {}) {
	return new Promise(acknowledge=> {
		Dialog.show({
			...extra,
			confirmButtonClass: extra.confirmButtonClass || 'caution',
			iconClass: extra.iconClass || 'caution',
			message, title,
			onConfirm: ()=> acknowledge()
		});
	});
}

export function areYouSure (message, title = 'Are you sure?', extra = {}) {
	return new Promise((acknowledge, cancel)=> {
		Dialog.show({
			...extra,
			confirmButtonClass: extra.confirmButtonClass || 'caution',
			iconClass: extra.iconClass || 'caution',
			message, title,
			onConfirm: ()=> acknowledge(),
			onCancel: ()=> cancel('Prompt Canceled')
		});
	});
}

/**
 * @typedef ModalReference
 * @param {Function} dismiss close the Dialog
 * @param {Node} mountPoint DOM element the dialog is mounted at
 */

/**
 * Display a modal
 *
 * @param  {React.Element} content The JSX expression to render into a dialog
 * @param  {String|Object} options Options or className
 * @param {String} options.className Additional classname to add to the dialog
 * @param {Boolean} options.closeOnMaskClick Enables dismissing the dialog when the mask is clicked.
 * @param {Function} options.onBeforeDismiss ----
 * @param {Node} options.mountPoint the DOM node that the dialog should mount/re-render to.
 * @return {ModalReference} Stuff & Things
 */
export function modal (content, options = {}) {
	//Back-compat... if the second arg is a string, wrap it into an "options" object...otherwise, passthrough.
	options = (typeof options === 'string') ? {className: options} : options;

	const {className, closeOnMaskClick, onBeforeDismiss, mountPoint} = options;

	const {createElement: ce} = global.document || {};
	const makeDOM = o => ce && Object.assign(ce.call(document, o.tag || 'div'), o);

	const container = mountPoint || makeDOM({className: 'modal'});
	document.body.appendChild(container);

	function dismiss () {
		if (onBeforeDismiss && onBeforeDismiss() === false) {
			return;
		}
		ReactDOM.unmountComponentAtNode(container);
		if (container.parentNode) {
			document.body.removeChild(container);
		}
	}

	ReactDOM.render(
		<Modal onDismiss={dismiss} className={className} closeOnMaskClick={closeOnMaskClick}>{content}</Modal>,
		container
	);

	return {
		dismiss,
		mountPoint: container
	};

}
