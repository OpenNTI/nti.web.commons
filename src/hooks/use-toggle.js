import { useState, useCallback } from 'react';

export function useToggle(initial = false) {
	const [state, setState] = useState(initial);
	const toggle = useCallback(() => setState(x => !x), []);
	return [state, toggle];
}
