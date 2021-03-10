import React from 'react';

import { scoped } from '@nti/lib-locale';

const DEFAULT_TEXT = {
	noMatches: 'No items match the selected filter.',
};

const t = scoped('common.components.lists', DEFAULT_TEXT);

export default function NoMatches() {
	return <div className="notice nomatches">{t('noMatches')}</div>;
}
