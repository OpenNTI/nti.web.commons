/*eslint no-console: 0*/
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {SomeComponent} from '../../src/index';

import 'normalize.css';

//Kitchen Sink
ReactDOM.render(
	<div>
		<SomeComponent/>
	</div>,
	document.getElementById('content')
);
