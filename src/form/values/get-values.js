import {getValidationErrors, isValid} from '../validation';

import getFormData from './get-form-data';
import getJSON from './get-json';

export default function getValues (form) {
	return {
		get formData () { return getFormData(form); },
		get json () { return getJSON(form); },
		get isValid () { return isValid(form); },

		getValidationErrors: () => getValidationErrors(form)
	};
}