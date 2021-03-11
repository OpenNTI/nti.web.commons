import React from 'react';

import Error from '../Error';

export default {
	title: 'Components/Error',
	component: Error,
};

export const Examples = () => (
	<>
		<Error>
			<p>Error children</p>
		</Error>
		<hr />
		<Error message="error message" />
		<hr />
		<Error message="error message" inline />
	</>
);
