import { Box } from '../Box';

const Template = args => <Box {...args} />;

export const Basic = Template.bind({});
Basic.args = {
	p: 'md',
	sh: 'sm',
};

export default {
	title: 'Box',
	component: Box,
};
