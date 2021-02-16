import React from 'react';
import PropTypes from 'prop-types';
import { HOC } from '@nti/lib-commons';

const KEYS = [
	'fullscreenElement',
	'webkitFullscreenElement',
	'mozFullScreenElement',
	'msFullscreenElement',
];

const EVENTS = [
	'fullscreenchange',
	'webkitfullscreenchange',
	'mozfullscreenchange',
	'msfullscreenchange',
];

function hasDocument() {
	return typeof document !== 'undefined';
}

function getFullScreenElement() {
	if (!hasDocument) {
		return null;
	}

	for (let key of KEYS) {
		if (document[key] != null) {
			return document[key];
		}
	}
}

class FullScreenMonitor extends React.Component {
	static propTypes = {
		_component: PropTypes.any,
		_componentRef: PropTypes.func,
		_propName: PropTypes.string,
	};

	state = {};

	componentDidMount() {
		this.setState({
			fullscreenElement: getFullScreenElement(),
		});

		this.addListeners();
	}

	componentWillUnmount() {
		this.removeListeners();
	}

	addListeners() {
		if (!hasDocument) {
			return;
		}

		this.removeListeners();

		const onFullScreenChange = () => {
			const { fullscreenElement: oldEl } = this.state;
			const newEl = getFullScreenElement();

			if (oldEl !== newEl) {
				this.setState({
					fullscreenElement: newEl,
				});
			}
		};

		for (let e of EVENTS) {
			document.addEventListener(e, onFullScreenChange);
		}

		this.cleanupListeners = () => {
			for (let e of EVENTS) {
				document.removeEventListener(e, onFullScreenChange);
			}

			delete this.cleanupListeners;
		};
	}

	removeListeners() {
		if (this.cleanupListeners) {
			this.cleanupListeners();
		}
	}

	render() {
		const {
			_component: Cmp,
			_componentRef,
			_propName,
			...otherProps
		} = this.props;
		const { fullscreenElement } = this.state;
		const props = {
			...otherProps,
			[_propName]: fullscreenElement,
			ref: _componentRef,
		};

		return <Cmp {...props} />;
	}
}

export default function fullScreenMonitor(propName = 'fullscreenElement') {
	return function factory(Component) {
		const name = 'FullScreenMonitor';
		const cmp = React.forwardRef((props, ref) => {
			return (
				<FullScreenMonitor
					_component={Component}
					_componentRef={ref}
					_propName={propName}
					{...props}
				/>
			);
		});

		cmp.displayName = name;
		HOC.hoistStatics(cmp, Component, name);

		return cmp;
	};
}
