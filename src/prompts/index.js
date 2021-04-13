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
	return new Promise((acknowledge, cancel) => {
		Prompt.show({
			...extra,
			confirmButtonClass: extra.confirmButtonClass || 'caution',
			iconClass: extra.iconClass || 'caution',
			message,
			title,
			onConfirm: () => acknowledge(true),
			// FIXME: do not reject, acknowledge false.
			onCancel: () => cancel(new Error('Prompt Canceled')),
		});
	});
}

/**
 * Display a modal
 *
 * @see {ModalManager#show()}
 * @param  {React.Element} content The JSX expression to render into a dialog
 * @param  {string|Object} options Options or className
 * @returns {ModalReference} Stuff & Things
 */
export function modal(content, options) {
	return Manager.show(content, options);
}
