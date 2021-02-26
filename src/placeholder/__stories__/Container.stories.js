import React from 'react';

import { Container as ContainerPlaceholder } from '../Container';

export default {
	title: 'Placeholder/Container',
	component: ContainerPlaceholder,
};

function InnerComponent(props) {
	return (
		<div {...props}>
			<h1>Test Component</h1>
		</div>
	);
}

const Test = styled(InnerComponent)`
	width: 200px;
	height: 50px;
	background: blue;
`;

export const Styled = props => (
	<>
		<b>Styled Component:</b>
		<br />
		<br />
		<Test />
		<br />
		<br />
		<b>Placeholder:</b>
		<br />
		<br />
		<ContainerPlaceholder as={Test} {...props} />
	</>
);
