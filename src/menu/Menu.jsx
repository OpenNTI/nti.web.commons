import React from 'react';

import * as Flyout from '../flyout';
import * as List from '../components/list';
import { Check as CheckIcon } from '../icons';

const MenuTitle = styled('h1')`
	font: normal 300 1.25em/2em var(--body-font-family);
	color: white;
	font-size: 18px;
	margin: 0;
	white-space: nowrap;

	:global(.library-light-background) & {
		color: var(--secondary-grey);
	}
`;

const MenuList = styled(List.Unadorned)`
	font-size: 14px;
	line-height: 19px;
	font-weight: 600;
	color: var(--primary-grey);
	border-radius: 4px;
	min-width: 200px;
`;

const MenuOption = styled('li')`
	padding: 1rem 1.25rem 1rem 2.25rem;
	border-bottom: 1px solid var(--border-grey-light);
	display: flex;
	flex-direction: row;
	align-items: center;
	position: relative;

	&.active {
		background: rgba(var(--primary-blue-rgb), 0.25);
	}
`;

const Check = styled(CheckIcon)`
	color: var(--primary-blue);
	font-size: 1rem;
	position: absolute;
	left: 1rem;
`;

const MenuContent = ({
	dismissFlyout,
	value,
	options,
	onChange,
	getText,
	...other
}) => {
	const onClick = (event, option) => {
		event?.stopPropagation?.();
		event?.preventDefault?.();
		onChange(option);
		dismissFlyout();
	};
	return (
		<MenuList>
			{options.map(option => {
				const active = value === option;
				return (
					<MenuOption
						key={option}
						active={active}
						onClick={e => onClick(e, option)}
					>
						{active && <Check />}
						{getText(option)}
					</MenuOption>
				);
			})}
		</MenuList>
	);
};

const t = x => x;

export const Menu = ({
	getText = t,
	value,
	title = getText(value),
	options,
	onChange,
}) => {
	const Text = <MenuTitle>{title}</MenuTitle>;
	return !options?.length ? (
		Text
	) : (
		<Flyout.Triggered
			horizontalAlign={Flyout.ALIGNMENTS.LEFT}
			trigger={Text}
		>
			<MenuContent
				value={value}
				onChange={onChange}
				options={options}
				getText={getText}
			/>
		</Flyout.Triggered>
	);
};
