import React from 'react';
import PropTypes from 'prop-types';

import Container from './container';
import Context from './Context';
import { Locations, DefaultLocation, Styles, DefaultStyle } from './Constants';
import { Factory, Card, ErrorBar, MessageBar, MessageCard } from './layouts';

Toast.Card = Factory.Wrap(Toast, Card);
Toast.ErrorBar = Factory.Wrap(Toast, ErrorBar);
Toast.MessageBar = Factory.Wrap(Toast, MessageBar);
Toast.MessageCard = Factory.Wrap(Toast, MessageCard);
Toast.Container = Container;
Toast.Locations = Locations;
Toast.propTypes = {
	children: PropTypes.node,
	location: PropTypes.oneOf(Object.values(Locations)),
	style: PropTypes.oneOf(Object.values(Styles)),
};
export default function Toast({
	children,
	location = DefaultLocation,
	style = DefaultStyle,
}) {
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
				location,
				style,
				contents: React.Children.only(children),
			});
		} else {
			container.updateToast(toastId.current, {
				location,
				style,
				contents: React.Children.only(children),
			});
		}
	}, [children, location, style]);

	return null;
}
