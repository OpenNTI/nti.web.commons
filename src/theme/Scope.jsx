import React from 'react';
import PropTypes from 'prop-types';

import ApplyTheme from './Apply';
import ThemeContext from './Context';

ScopeTheme.propTypes = {
	scope: PropTypes.string,
};
export default function ScopeTheme({ scope, ...otherProps }) {
	return (
		<ThemeContext.Consumer>
			{theme => {
				const scoped = theme?.scope?.(scope) || null;
				return <ApplyTheme value={scoped} {...otherProps} />;
			}}
		</ThemeContext.Consumer>
	);
}
