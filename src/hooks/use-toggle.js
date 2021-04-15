import { useState, useCallback } from 'react';

export function useToggle(initial = false) {
	const [state, setState] = useState(initial);
	const toggle = useCallback(e => {
		// if the toggle function is passed directly to an onClick, mark it handled.
		e?.stopPropagation?.();
		e?.preventDefault?.();
		setState(x => (typeof e === 'boolean' ? e : !x)), [];
	});
	return [state, toggle];
}
