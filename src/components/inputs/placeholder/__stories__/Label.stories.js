import React from 'react';

import Label from '../Label';

export default {
	title: 'Components/placeholder/Label',
	component: Label,
};

export const LabelPlaceholder = () => (
	<>
		<Label label="test">
			<input />
		</Label>

		<Label label="test" variant="underlined">
			<input />
		</Label>
	</>
);
