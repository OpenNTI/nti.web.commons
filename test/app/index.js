/*eslint no-console: 0*/
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Flyout} from '../../src/index';
import {Prompt} from '../../src/index';

import 'normalize.css';
import 'nti-style-common/fonts.scss';

function modal () {
	Prompt.modal(
		<div className="modal-demo">
			<button onClick={modal}>Modal</button>
		</div>
	);
}

//Kitchen Sink
ReactDOM.render(
	<div>
		<Flyout/>
		<div><button onClick={modal}>Modal</button></div>
	</div>,
	document.getElementById('content')
);
