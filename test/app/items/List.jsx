import React from 'react';

import {List} from '../../../src';

export default function ListTest () {
	return (
		<List.Selectable useGlobalListeners>
			<List.Selectable.Item value={1}>First</List.Selectable.Item>
			<List.Selectable.Item value={2}>Second</List.Selectable.Item>
			<List.Selectable.Item value={3}>Third</List.Selectable.Item>
			<List.Selectable.Item value={4}>Fourth</List.Selectable.Item>
			<List.Selectable.Item value={5}>Fifth</List.Selectable.Item>
		</List.Selectable>
	);
}