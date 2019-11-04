import { useContext } from 'react';
import {get} from '@nti/lib-commons';

import ThemeContext from './Context';

export function useTheme () {
	const theme = useContext(ThemeContext);

	return theme;
}

export function useThemeProperty (prop) {
	const theme = useTheme();

	return theme && get(theme, prop);
}