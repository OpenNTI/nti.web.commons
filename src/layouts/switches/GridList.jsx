import React from 'react';
import cx from 'classnames';

import Button from '../../components/Button';

const Box = styled.div`
	display: inline-flex;
	flex-direction: row;
	align-items: center;
	gap: 1px;
	background: var(--button-border);
`;

const Icon = styled(Button).attrs(({ layout, className, ...props }) => ({
	as: 'i',
	className: cx(`icon-${layout}`, className),
	plain: true,
	...props,
}))`
	flex: 0 0 auto;
	width: 36px;
	height: 26px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--tertiary-grey);
	background: white;

	&.selected {
		color: var(--secondary-grey);
	}
`;

export function GridList({ onChange, value = 'grid', ...props }) {
	const layouts = ['grid', 'list'];

	return (
		<Box {...props}>
			{layouts.map(name => (
				<Icon
					key={name}
					layout={name}
					selected={value === name}
					onClick={() => onChange?.(name)}
				/>
			))}
		</Box>
	);
}
