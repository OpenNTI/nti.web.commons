function trimCharacter (text) {
	return text.slice(0, -1);
}

function trimWord (text) {
	const lastSpace = text.lastIndexOf(' ');
	return text.slice(0, lastSpace);
}

export default function trimText (text) {
	const wordTrimmed = trimWord(text);

	return wordTrimmed === text ? trimCharacter(text) : wordTrimmed;
}