import React from 'react';
import PropTypes from 'prop-types';

import ThemeContext from './Context';

//TODO: make apply have a dom node defining custom properties for the theme

ApplyTheme.propTypes = {
	theme: PropTypes.object,
};
export default function ApplyTheme({ theme, ...otherProps }) {
	return <ThemeContext.Provider value={theme} {...otherProps} />;
}
