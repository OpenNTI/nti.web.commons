import React from 'react';
import PropTypes from 'prop-types';
import {HOC} from '@nti/lib-commons';

import {useThemeProperty} from './Hook';

ThemeProperty.propTypes = {
	_component: PropTypes.object,
	_componentRef: PropTypes.func,
	_themeProp: PropTypes.string,
	_propName: PropTypes.string
};
function ThemeProperty ({_component, _componentRef, _themeProp, _propName, ...otherProps}) {
	const Cmp = _component;
	const theme = useThemeProperty(_themeProp);

	const themeProps = {
		[_propName]: theme
	};

	return (
		<Cmp {...themeProps} ref={_componentRef} {...otherProps} />
	);
}

export default function WithThemeProperty (themeProp, propName = 'theme') {
	return (Component) => {
		const ThemePropertyWrapper = (props, ref) => {
			return (
				<ThemeProperty
					{...props}
					_component={Component}
					_componentRef={ref}
					_themeProp={themeProp}
					_propName={propName}
				/>
			);
		};

		const cmp = React.forwardRef(ThemePropertyWrapper);

		const typeName = Component ? (Component.displayName || Component.name) : '';
		const name = `WithThemeProperty(${typeName})`;

		HOC.hoistStatics(cmp, Component, name);

		return cmp;
	};
}