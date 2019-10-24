import Context from './Context';
import * as Hook from './Hook';
import themeBuilder from './build-theme';

export const buildTheme = themeBuilder;
export const Consumer = Context.Consumer;
export const useTheme = Hook.useTheme;
export const useThemeProperty = Hook.useThemeProperty;

export Apply from './Apply';
export Scope from './Scope';

let globalTheme = null;

export const getGlobalTheme = () => {
	if (!globalTheme) {
		globalTheme = buildTheme(void 0, global.themeOverride || {});
	}


	return globalTheme;
};