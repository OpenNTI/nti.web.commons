
import GridCmp from '../Grid';

const Grid = args => <GridCmp {...args} />;

const Block = styled('div')`
	background: aliceblue;
	padding: 1rem;
	min-height: 100px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const content = (length = 8) =>
	Array.from({ length }, (_, i) => <Block key={i}>Item {i}</Block>);

export const Basic = props => {
	return <Grid {...props}>{content()}</Grid>;
};

export const WithHeader = props => {
	return (
		<div>
			<Grid {...props} singleColumn>
				<h4>Header</h4>
			</Grid>
			<Grid {...props}>{content}</Grid>
		</div>
	);
};

export const WithChildHeader = props => {
	return (
		<div>
			<Grid {...props} singleColumn>
				<h4>Header</h4>
			</Grid>
			<Grid {...props}>
				{content(3)}
				<Grid {...props} singleColumn>
					<h4>Child Header</h4>
				</Grid>
				{content(6)}
			</Grid>
		</div>
	);
};

export default {
	title: 'Grid',
	component: Grid,
	argTypes: {
		colWidth: {
			control: { type: 'number', min: 1 },
			defaultValue: 250,
		},
		gap: {
			control: { type: 'number', min: 0 },
			defaultValue: 10,
		},
	},
};
