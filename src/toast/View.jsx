import React from 'react';

import Container from './container';
import Context from './Context';

Toast.Container = Container;
export default function Toast () {
	const container = React.useContext(Context);

	if (!container) {
		//TODO: if there's not toast container show toasts on the body
		throw new Error('Unable to render toast outside of toast container');
	}

	React.useEffect(() => {
		container.addToast({
			id: container.getNextId()
		});
	}, []);

	return null;
}