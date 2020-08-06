import XRegExp from 'xregexp';

const MatchSplitRegex = /<hit>|<\/hit>/g;

function extractTermFromMatch (match) {
	const parts = match.split(MatchSplitRegex);

	//with splitting the em tags the odd items should be terms between the tags
	return parts.reduce((acc, part, index) => {
		if (index % 2 === 1) {
			acc.push(part);
		}

		return acc;
	}, []);
}

function contentRegexFromSearchTerm (term, isPhrase) {
	if (isPhrase) {
		term = XRegExp.replace(term, new XRegExp('\\p{^L}+([^\\]]|$)', 'g'), '\\p{^L}+$1');
	} else {
		term = XRegExp.replace(term, new XRegExp('\\p{P}+', 'g'), '\\p{P}+');
	}
	return term;
}

/*
* Returns a regex suitable for matching content from a search hit fragment
* returned from the dataserver.  If captureMatches is true regex capture groups
* will surround the various components of the fragment marking matching and non
* matching parts that correspond to the matches provided with the fragment.  When
* captureMatches is true this function returns an object with two properties. 're'
* is the regular expression, matchingGroups is an array of ints marking which capture
* group of re corresponds to each for the fragments matches.  These values are indexed start
* at 1.  Example;	a fragment of "the brown fox" with a match corresponding to "brown" will
* return the following: /(the )(brown)( fox)/
*/
export function contentRegexForFragment (fragment, phraseSearch) {
	const {Matches: matches = []} = fragment;
	let terms = [];

	matches.forEach(match => {
		let term = extractTermFromMatch(match);

		if (term) {
			terms = terms.concat(term);
		}
	});

	const escapedParts = terms.map(item => contentRegexFromSearchTerm(item, phraseSearch));

	return new XRegExp(escapedParts.join('|'), 'ig');
}
