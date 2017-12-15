import {isScreenWidthInRange} from './utils';

//The ranges are taken from $responsive-ranges in nti-style-common/responsive.scss
export const isMobile = () => isScreenWidthInRange(0, 480);
export const isTablet = () => isScreenWidthInRange(481, 1024);
export const isDesktop = () => isScreenWidthInRange(1025, Infinity);
