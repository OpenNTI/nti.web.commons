import { DateTime as DateTimeBase } from './components/DateTime';
import * as components from './components';
import * as utils from './utils';

export const DateTime =
	/** @type {DateTimeBase & components & utils} */ Object.assign(
		DateTimeBase,
		components,
		utils
	);
