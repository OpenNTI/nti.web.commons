import React from 'react';
import ReactDOM from 'react-dom';

import Radio from '../Radio';

const getDom = cmp => ReactDOM.findDOMNode(cmp);
const getText = cmp => getDom(cmp).textContent;

describe('Radio', () => {
	let container = document.createElement('div');
	let newNode;

	document.body.appendChild(container);

	function setup () {
		beforeEach(()=> {
			if (newNode) {
				document.body.removeChild(newNode);
			}
			newNode = document.createElement('div');
			document.body.appendChild(newNode);
		});

		afterEach(()=> {
			if (newNode) {
				ReactDOM.unmountComponentAtNode(newNode);
				document.body.removeChild(newNode);
				newNode = null;
			}
		});
	}

	afterAll(()=> {
		ReactDOM.unmountComponentAtNode(container);
		document.body.removeChild(container);
	});

	const test = (props, ...children) => [
		ReactDOM.render(
			React.createElement(Radio, props, ...children),
			newNode
		),

		ReactDOM.render(
			React.createElement(Radio, props, ...children),
			container
		)
	];

	setup();


	it('Base Case', () => {
		test({label: 'Test'})
			.map(getText)
			.forEach(x => expect(x).toEqual('Test'));
	});


	//TODO: Validate DOM structure.
	//TODO: Validate children && DIV.sub do not render if it is not checked.

});
