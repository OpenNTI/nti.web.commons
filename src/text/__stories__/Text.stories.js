import React from 'react';
import {scoped} from '@nti/lib-locale';

import Text from '../View';

const t = scoped('storybook.Text', {
	plain: 'Localized Text',
	complex: 'String placeholder: %(string)s. Component placeholder: %(component)s.'
});

const Translate = Text.Translator(t);

export default {
	title: 'Typography',
	component: Text
};

export const Raw = () => (<Text>Raw Text</Text>);
export const Base = () => (<Text.Base>Base Text Styles</Text.Base>);

export const SimpleTranslate = () => (<Translate.Base localeKey="plain" />);
export const ComplexTranslate = () => (
	<Translate.Base
		localeKey="complex"
		with={{
			string: 'string',
			component: (<b>Component</b>)
		}}
	/>
);
