import React from 'react';

import Text from '../Text';
import InputIcon from '../Icon';
import PlaceholderLabel from '../placeholder/Label';
import * as Icons from '../../../icons';

export default {
	title: 'Components/inputs/Input Icon',
	component: InputIcon
};

export const Icon = () => (
	<>
		<InputIcon icon={<Icons.Search />} side="left">
			<Text placeholder="Input" />
		</InputIcon>
		<br />
		<InputIcon icon={<Icons.Search />} side="right">
			<Text placeholder="Input" />
		</InputIcon>
		<br />
		<InputIcon icon={<Icons.Search />}>
			<PlaceholderLabel label="Input">
				<Text />
			</PlaceholderLabel>
		</InputIcon>
		<InputIcon icon={<Icons.Search />}>
			<PlaceholderLabel label="Input" variant="underlined">
				<Text />
			</PlaceholderLabel>
		</InputIcon>
	</>
);
