import { useContext } from 'react';
import {ObjectUtils} from '@nti/lib-commons';

import ThemeContext from './Context';

export function useTheme () {
	const theme = useContext(ThemeContext);

	return theme;
}

export function useThemeProperty (prop) {
	const theme = useTheme();

	return theme && ObjectUtils.get(theme, prop);
}