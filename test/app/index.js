/*eslint no-console: 0*/
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Flyout} from '../../src/index';

import 'normalize.css';
import 'nti-style-common/fonts.scss';

//Kitchen Sink
ReactDOM.render(
	<div>
		<Flyout/>
	</div>,
	document.getElementById('content')
);
