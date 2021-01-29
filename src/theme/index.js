import Context from './Context';
import * as Hook from './Hook';

export { default as buildTheme } from './build-theme';
export * from './GlobalTheme';

export const Consumer = Context.Consumer;
export const useTheme = Hook.useTheme;
export const useThemeProperty = Hook.useThemeProperty;

export { default as Apply } from './Apply';
export { default as Scope } from './Scope';

export { default as Asset } from './Asset';