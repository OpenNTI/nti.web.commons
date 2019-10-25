import Context from './Context';
import * as Hook from './Hook';

export buildTheme from './build-theme';
export * from './GlobalTheme';

export const Consumer = Context.Consumer;
export const useTheme = Hook.useTheme;
export const useThemeProperty = Hook.useThemeProperty;

export Apply from './Apply';
export Scope from './Scope';

