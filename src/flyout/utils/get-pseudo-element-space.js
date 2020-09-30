export default function getPseudoElementSpace (element) {
	try {
		return ['::before', '::after'].reduce((x, pseudo) => x + (parseInt(getComputedStyle(element, pseudo).height, 10) || 0), 0);
	} catch {
		return 0;
	}
}
