import React from 'react';

import {Theme} from '../../../src';

const theme = Theme.buildTheme();

theme.setOverrides({
	library: {
		navigation: {
			'background-color': 'dark'
		}
	}
});

export default class ThemeTest extends React.Component {
	componentDidMount () {
		console.log(theme.library.navigation.search);
	}

	render () {
		return (
			<div>
				Theme Test
			</div>
		);
	}
}