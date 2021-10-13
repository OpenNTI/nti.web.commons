
import LabelPlaceholder from '../LabelPlaceholder';

export default {
	title: 'Components/inputs/LabelPlaceholder',
	component: LabelPlaceholder,
};

export const Label = () => (
	<>
		<LabelPlaceholder label="test">
			<input />
		</LabelPlaceholder>

		<LabelPlaceholder label="test" variant="underlined">
			<input />
		</LabelPlaceholder>
	</>
);
