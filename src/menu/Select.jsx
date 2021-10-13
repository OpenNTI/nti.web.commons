
import * as Flyout from '../flyout';
import * as List from '../components/list';
import { Check as CheckIcon } from '../icons';
import { useMobileValue } from '../hooks';

const MenuTitle = styled('h1')`
	font: normal 300 1.25em/2em var(--body-font-family);
	font-size: 18px;
	margin: 0;
	white-space: nowrap;
	display: flex;
	align-items: baseline;
	position: relative;

	[class^='icon'] {
		font-size: 0.75em;
		margin-left: 0.5em;
	}

	color: var(--text-color-primary);
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

const NativeSelect = styled('select')`
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	width: 100%;
	opacity: 0;
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
	};
	return (
		<MenuList data-testid="menu-options">
			{options.map(option => {
				const active = value === option;
				return (
					<MenuOption
						key={option}
						active={active}
						data-testid={option}
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

export const Select = ({
	getText = t,
	value,
	title = getText(value),
	name = 'select-menu-trigger',
	options,
	onChange,
}) => {
	const hasOptions = !!options?.length;
	const isMobile = useMobileValue(true);
	const useNativeSelect = hasOptions && isMobile;
	const useFlyout = hasOptions && !useNativeSelect;

	const Text = (
		<MenuTitle data-testid={name} data-value={value}>
			{title} {hasOptions && <i className="icon-chevron-down" />}
			{useNativeSelect && (
				<NativeSelect
					value={value}
					onChange={e => onChange(e.target.value)}
				>
					{options.map(o => (
						<option key={o} value={o}>
							{getText(o)}
						</option>
					))}
				</NativeSelect>
			)}
		</MenuTitle>
	);

	return !useFlyout ? (
		Text
	) : (
		<Flyout.Triggered
			horizontalAlign={Flyout.ALIGNMENTS.LEFT}
			trigger={Text}
			autoDismissOnAction
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
