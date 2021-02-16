let seen = 0;

export default function getItemId() {
	seen += 1;

	return `selectable-item-${seen}`;
}
