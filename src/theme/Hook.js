import { useContext, useEffect } from 'react';
import {Events, ObjectUtils} from '@nti/lib-commons';

import {useForceUpdate} from '../hooks';

import ThemeContext from './Context';

// This constant is defined in a project we really should not add to commons...
// theme components and all should be extracted to an independent package.
const THEME_UPDATED = 'theme-updated';

export function useTheme () {
	const theme = useContext(ThemeContext);
	useThemeListener();
	return theme;
}

export function useThemeProperty (prop) {
	const theme = useTheme();

	return theme && ObjectUtils.get(theme, prop);
}


export function useThemeListener () {
	const update = useForceUpdate();

	useEffect(() => {
		const newTheme = (theme) => {
			update();
		};
		Events.Bus.addListener(THEME_UPDATED, newTheme);
		return () => {
			Events.Bus.removeListener(THEME_UPDATED, newTheme);
		};
	}, [update]);
}
