import createStrategy from './create-strategy';
import {TextRangeFinder} from './utils';

export default createStrategy({
	findRanges: (container, searchFor) => TextRangeFinder.findTextRanges(container, void 0, searchFor),
	isActive: (searchFor) => Boolean(searchFor)
});