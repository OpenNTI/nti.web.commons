import { useState } from 'react';

import { List } from '../../../src';

export default function ListTest() {
	const [selected, setSelected] = useState();

	return (
		<div>
			<List.Selectable.Unstyled
				controlledBy={global}
				selected={selected}
				onSelectedChange={setSelected}
			>
				<List.Selectable.Item value={1}>First</List.Selectable.Item>
				<List.Selectable.Item value={2}>Second</List.Selectable.Item>
				<List.Selectable.Item value={3}>Third</List.Selectable.Item>
				<List.Selectable.Item value={4}>Fourth</List.Selectable.Item>
				<List.Selectable.Item value={5}>Fifth</List.Selectable.Item>
			</List.Selectable.Unstyled>
			<select>
				<option>Option 1</option>
				<option>Option 2</option>
				<option>Option 3</option>
				<option>Option 4</option>
				<option>Option 5</option>
				<option>Option 6</option>
			</select>
		</div>
	);
}
