/*eslint no-console: 0*/
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Flyout} from '../../src/index';
import {Prompt} from '../../src/index';

import 'normalize.css';
import 'nti-style-common/fonts.scss';


function modal () {

	function ModalContent (props) {
		const style = {
			padding: '5rem 1rem 1rem',
			background: 'white',
			width: '80%',
			textAlign: 'right',
			boxSizing: 'border-box',
			borderRadius: '3px'
		};
		return (
			<div style={style}>
				<button onClick={props.onDismiss}>Close</button>
				<button onClick={modal}>Open</button>
			</div>
		);
	}

	ModalContent.propTypes = {
		onDismiss: React.PropTypes.func
	};


	Prompt.modal(
		<ModalContent />
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
