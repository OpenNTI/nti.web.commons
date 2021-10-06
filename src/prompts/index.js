export { default as Dialog } from './Dialog';
export { default as Triggered } from './Triggered';
import Prompt from './Prompt';
import ManagerImport from './ModalManager';
export * from './layouts';

export const Manager = ManagerImport;

export function alert(message, title = 'Alert', extra = {}) {
	return new Promise(acknowledge => {
		Prompt.show({
			...extra,
			confirmButtonClass: extra.confirmButtonClass || 'caution',
			iconClass: extra.iconClass || 'caution',
			message,
			title,
			onConfirm: () => acknowledge(),
		});
	});
}

export function areYouSure(message, title = 'Are you sure?', extra = {}) {
	return new Promise((acknowledge, reject) => {
		Prompt.show({
			...extra,
			confirmButtonClass: extra.confirmButtonClass || 'caution',
			iconClass: extra.iconClass || 'caution',
			message,
			title,
			onConfirm: () => acknowledge(true),
			//FIXME: do not reject, acknowledge false.
			onCancel: () => reject(new Error('Prompt Canceled')),
		});
	});
}

/**
 * Don't use this.
 *
 * @deprecated
 * @see {ModalManager#show()}
 * @param  {JSX.Element} content The JSX expression to render into a dialog
 * @param  {string|Object} options Options or className
 * @returns {object} Stuff & Things
 */
export function modal(content, options) {
	// eslint-disable-next-line no-console
	console.warn(
		'This call needs to be rewritten to render a <Dialog> instead'
	);
	return Manager.show(content, options);
}
