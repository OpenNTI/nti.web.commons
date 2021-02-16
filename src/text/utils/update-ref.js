export function updateRef(ref, current) {
	if (ref) {
		if (typeof ref === 'string') {
			throw new Error('Unsupported ref value');
		}
		if (typeof ref === 'function') {
			ref(current);
		} else {
			ref.current = current;
		}
	}
}
