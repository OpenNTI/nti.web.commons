import React from 'react';

import Controls from '../Controls';

export default {
	title: 'Paging/Controls',
	component: Controls,
	argTypes: {
		current: {control: {type: 'number', min: 0}},
		total: {control: {type: 'number', min: 0}}
	}
};

export const Story = (props) => (<Controls {...props} />);
