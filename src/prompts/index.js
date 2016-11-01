import Dialog from './components/Dialog';
import Manager from './ModalManager';

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
 * Display a modal
 *
 * @see {ModalManager#show()}
 * @param  {React.Element} content The JSX expression to render into a dialog
 * @param  {String|Object} options Options or className
 * @return {ModalReference} Stuff & Things
 */
export function modal (content, options) {
	return Manager.show(content, options);
}
