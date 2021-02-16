import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {
	decorate,
	restProps,
	PropTypes as NTIPropTypes,
} from '@nti/lib-commons';

import { LEFT, RIGHT } from './Constants';
import Store from './Store';
import Container from './Container';

class Aside extends React.Component {
	static Container = Container;

	static propTypes = {
		component: NTIPropTypes.component,
		side: PropTypes.oneOf([LEFT, RIGHT]),

		placeholder: PropTypes.object,
		showAside: PropTypes.func,
		hideAside: PropTypes.func,
	};

	componentDidMount() {
		const { showAside, component, side } = this.props;

		if (showAside) {
			showAside(component, { side: side || RIGHT });
		}
	}

	componentWillUnmount() {
		const { hideAside, component } = this.props;

		if (hideAside) {
			hideAside(component);
		}
	}

	render() {
		const { component: Cmp, placeholder } = this.props;

		if (!placeholder) {
			return null;
		}

		const otherProps = restProps(Aside, this.props);
		const content = <Cmp {...otherProps} />;

		return ReactDOM.createPortal(content, placeholder);
	}
}

export default decorate(Aside, [
	Store.monitor(['placeholder', 'showAside', 'hideAside']),
]);
