import {v4 as uuid} from 'uuid';
import React from 'react';

//https://stackoverflow.com/questions/9635625/javascript-regex-to-remove-illegal-characters-from-dom-id
//pronounced id-eh-fi
const idify = s => s.replace(/^[^a-z]+|[^\w:.-]+/gi, '');

export function useId (namespace) {
	const [id] = React.useState(() => {
		const guid = uuid();

		if (!namespace) { return guid; }

		return `${idify(namespace)}_${guid}`;
	});

	return id;
}
