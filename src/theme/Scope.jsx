import React from 'react';
import PropTypes from 'prop-types';

import ThemeContext from './Context';

ScopeTheme.propTypes = {
	scope: PropTypes.string
};
export default function ScopeTheme ({scope, ...otherProps}) {
	return (
		<ThemeContext.Consumer>
			{(theme) => {
				const scoped = (theme && theme.scope) ? theme.scope(scope) : null;

				return (<ThemeContext.Provider value={scoped} {...otherProps} />);
			}}
		</ThemeContext.Consumer>
	);
}