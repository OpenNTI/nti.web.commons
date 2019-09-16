import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import {DialogButtons} from '../../../components';

const t = scoped('commons.prompts.layouts.base-window.Footer', {
	done: 'Done'
});

BaseWindowFooter.propTypes = {
	buttons: PropTypes.any,
	doClose: PropTypes.func
};
export default function BaseWindowFooter ({buttons, doClose}) {
	const dialogButtons = buttons || (doClose ? [{label: t('done'), onClick: doClose}] : null);

	return (
		<DialogButtons buttons={dialogButtons} flat />
	);
}