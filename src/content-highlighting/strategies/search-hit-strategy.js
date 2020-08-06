import {SearchFragment, TextRangeFinder} from './utils';
import createStrategy from './create-strategy';
import {getHitForContainer} from './SearchHitStore';

export default createStrategy({
	findRanges: (container, searchContainer) => {
		const searchHit = getHitForContainer(searchContainer);

		if (!searchHit) { return []; }

		const {hit, phraseSearch} = searchHit;

		return (hit.Fragments ?? []).reduce((acc, fragment) => {
			const regex = SearchFragment.contentRegexForFragment(fragment, phraseSearch, true);

			return [...acc, ...TextRangeFinder.findTextRanges(container, void 0, regex)];
		}, []);
	},
	isActive: (searchContainer) => {
		return Boolean(searchContainer) && Boolean(getHitForContainer(searchContainer));
	}
});
