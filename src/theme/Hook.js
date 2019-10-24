import { useContext } from 'react';

import ThemeContext from './Context';

export function useTheme () {
	const theme = useContext(ThemeContext);

	return theme;
}

export function useThemeProperty (prop) {
	const theme = useTheme();

	return theme && theme[prop];
}