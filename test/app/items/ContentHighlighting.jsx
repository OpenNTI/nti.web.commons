import React from 'react';

import {ContentHighlighting} from '../../../src';

const {TextStrategy} = ContentHighlighting.Strategies;

const Paragraphs = [
	'There\'s only one man I\'ve ever called a coward, and that\'s Brian Doyle Murray. No, what I\'m calling you is a television actor. It\'s called \'taking advantage.\' It\'s what gets you ahead in life. Not tricks, Michael, illusions.',
	'No! I was ashamed to be SEEN with you. I like being with you. I don\'t criticize you! And if you\'re worried about criticism, sometimes a diet is the best defense. I\'ve opened a door here that I regret. No! I was ashamed to be SEEN with you. I like being with you.',
	'Did you enjoy your meal, Mom? You drank it fast enough. Really? Did nothing cancel? No… but I\'d like to be asked! I don\'t criticize you! And if you\'re worried about criticism, sometimes a diet is the best defense.',
	'Say goodbye to these, because it\'s the last time! That\'s what it said on \'Ask Jeeves.\' Now, when you do this without getting punched in the chest, you\'ll have more fun. Army had half a day.'
];

const getRandParagraph = () => Paragraphs[Math.floor(Math.random() * Paragraphs.length)];

export default function ContentHighlightingTest () {
	const [search, setSearch] = React.useState(null);
	const strategy = TextStrategy.useStrategy(search);

	const [text, setText] = React.useState([getRandParagraph(), getRandParagraph(), getRandParagraph()]);

	const addText = () => setText([...text, getRandParagraph()]);

	return (
		<div>
			<input value={search ?? ''} onChange={(e) => setSearch(e.target.value)} />
			<button onClick={addText}>Add Paragraph</button>
			<ContentHighlighting strategy={strategy}>
				{text.map((t, key) => (
					<p key={key}>
						{t}
					</p>
				))}
				<p>
					Test paragraph to find <span>bologny</span>
				</p>
			</ContentHighlighting>
		</div>
	);
}
