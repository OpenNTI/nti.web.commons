import React from 'react';
import ReactDOM from 'react-dom';

import DayPicker from '../DayPicker';

const getDom = cmp => ReactDOM.findDOMNode(cmp);
const getText = cmp => getDom(cmp).textContent;

describe('DayPicker', () => {
	// Check Today is selected on creation
	// Test days after to day are disabled
	// Check if you can change day
	// Check if you can change month
	let container = document.createElement('div');
	let newNode;

	document.body.appendChild(container);

	function setup () {
		beforeEach(() => {
			if (newNode) {
				document.body.removeChild(newNode);
			}
			newNode = document.createElement('div');
			document.body.appendChild(newNode);
		});

		afterEach(() => {
			if (newNode) {
				ReactDOM.unmountComponentAtNode(newNode);
				document.body.removeChild(newNode);
				newNode = null;
			}
		});
	}

	afterAll(() => {
		ReactDOM.unmountComponentAtNode(container);
		document.body.removeChild(container);
	});

	const test = (props, ...children) => [
		ReactDOM.render(
			React.createElement(DayPicker, props, ...children),
			newNode
		),

		ReactDOM.render(
			React.createElement(DayPicker, props, ...children),
			container
		)
	];

	setup();

	it('Base case: Day Prop passed is Day State', () => {
		const now = new Date();

		test({value: now})
			.map((cmp) => {
				const {value} = cmp.state;
				expect(value.getHours()).toEqual(now.getHours());
				expect(value.getMinutes()).toEqual(now.getMinutes());
				expect(value.getDate()).toEqual(now.getDate());
				expect(value.getMonth()).toEqual(now.getMonth());
				expect(value.getYear()).toEqual(now.getYear());
			});
	});
});
