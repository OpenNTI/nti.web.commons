import React from 'react';
import PropTypes from 'prop-types';
import {HOC} from '@nti/lib-commons';
import {getViewportHeight, getViewportWidth} from '@nti/lib-dom';

const NOT_DETERMINED = -1;

class ScreenSizeMonitor extends React.Component {
	static NotDetermined = NOT_DETERMINED

	static propTypes = {
		children: PropTypes.any,
		widthProp: PropTypes.string,
		heightProp: PropTypes.string
	}

	state = {width: NOT_DETERMINED, height: NOT_DETERMINED}

	componentDidMount () {
		this.setup();
	}

	componentWillUnmount () {
		this.teardown();
	}

	setup () {
		this.teardown();
		this.maybeUpdate();

		const handler = () => this.maybeUpdate();

		global.addEventListener('resize', handler);

		this.cleanupListener = () => {
			global.removeEventListener('resize', handler);
			delete this.cleanupListener;
		};
	}

	teardown () {
		if (this.cleanupListener) {
			this.cleanupListener();
		}
	}

	maybeUpdate () {
		if (this.updateTimeout) { return; }

		this.updateTimeout = setTimeout(() => {
			delete this.updateTimeout;
			
			const {width, height} = this.state;
			const newWidth = getViewportWidth();
			const newHeight = getViewportHeight();

			if (newWidth === width && newHeight === height) { return; }

			this.setState({
				width: newWidth,
				height: newHeight
			});
		}, 50);

	}


	render () {
		const {width, height} = this.state;
		const {children, widthProp, heightProp} = this.props;
		const child = React.Children.only(children);

		return React.cloneElement(child, {[widthProp]: width, [heightProp]: height});
	}
}

screenSize.didChange = (props, prevProps) => {
	return props.screenWidth !== prevProps.screenWidth || props.screenHeight !== prevProps.screenHeight;
};
export default function screenSize (widthProp = 'screenWidth', heightProp = 'screenHeight') {
	return (Component) => {
		const ScreenSizeWrapper = (props, ref) => {
			return (
				<ScreenSizeMonitor widthProp={widthProp} heightProp={heightProp}>
					<Component {...props} ref={ref} />
				</ScreenSizeMonitor>
			);
		};
		const cmp = React.forwardRef(ScreenSizeWrapper);

		const typeName = Component ? Component.displayName || Component.name : '';
		const name = `ScreenSize(${typeName})`;

		HOC.hoistStatics(cmp, Component, name);

		return cmp;
	};
}