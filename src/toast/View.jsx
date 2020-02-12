import React from 'react';
import PropTypes from 'prop-types';

import Container from './container';
import Context from './Context';
import {Locations} from './Constants';
import {Factory, MessageBar} from './layouts';

Toast.MessageBar = Factory.Wrap(Toast, MessageBar);
Toast.Container = Container;
Toast.Locations = Locations;
Toast.propTypes = {
	children: PropTypes.node
};
export default function Toast ({children}) {
	const container = React.useContext(Context);
	const toastId = React.useRef(null);

	if (!container) {
		//TODO: if there's not toast container show toasts on the body
		throw new Error('Unable to render toast outside of toast container');
	}

	React.useEffect(() => {
		return () => container.removeToast(toastId.current);
	}, []);

	React.useEffect(() => {
		if (!toastId.current) {
			const id = container.getNextId();
			toastId.current = id;

			container.addToast({
				id,
				contents: React.Children.only(children)
			});
		} else {
			container.updateToast(toastId.current, {
				contents: React.Children.only(children)
			});
		}
	}, [children]);


	return null;
}