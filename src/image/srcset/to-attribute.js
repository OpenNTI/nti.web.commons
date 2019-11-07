export default function toAttribute (srcset) {
	return srcset
		.map(set => set.query ? `${set.src} ${set.query}` : set.src)
		.join(', ');
}