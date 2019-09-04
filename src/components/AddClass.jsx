import React from 'react';
import {addClass, removeClass} from '@nti/lib-dom';

function add (node, className) {
	add.count = (add.count || 0) + 1;
	addClass(node, className);
	return () => {
		add.count = Math.max(add.count - 1, 0); // ensure we're never negative. shouldn't happen anyway.
		if (!add.count) {
			removeClass(node, className);
		}
	};
}

export default function AddClass ({node = document.body, className}) {
	React.useEffect(() => add(node, className), [node, className]);
	return null;
}
