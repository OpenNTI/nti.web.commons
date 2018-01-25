import {isScreenWidthInRange} from './utils';

//The ranges are taken from $responsive-ranges in nti-style-common/responsive.scss
export const isMobile = () => isScreenWidthInRange(0, 480);
export const isTablet = () => isScreenWidthInRange(481, 1024);
export const isDesktop = () => isScreenWidthInRange(1025, Infinity);

let CONTEXT_FLAG = null;
const WEBAPP_CONTEXT = 'webapp';
const MOBILE_CONTEXT = 'mobile';

function setContext (context) {
	if (CONTEXT_FLAG !== null) {
		throw new Error('Cannot override context once its been set');
	}

	CONTEXT_FLAG = context;
}

export const setWebappContext = () => setContext(WEBAPP_CONTEXT);
export const setMobileContext = () => setContext(MOBILE_CONTEXT);

export const isWebappContext = () => CONTEXT_FLAG === WEBAPP_CONTEXT;
export const isMobileContext = () => CONTEXT_FLAG === MOBILE_CONTEXT;
