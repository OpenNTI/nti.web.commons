import buildTheme from './build-theme';

let globalTheme = null;

export const getGlobalTheme = () => {
	if (!globalTheme) {
		globalTheme = buildTheme(void 0, global.themeOverride || {});
	}


	return globalTheme;
};