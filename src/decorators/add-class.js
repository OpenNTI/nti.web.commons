import React from 'react';
import {addClass as add, removeClass as remove} from '@nti/lib-dom';

export default function addClass (node, className) {
	return function factory (Component) {
		return class AddClassToBody extends React.Component {
			componentDidMount () {
				add(node, className);
			}

			componentWillUnmount () {
				remove(node, className);
			}

			render () {
				return <Component {...this.props} />;
			}
		};
	};
}
