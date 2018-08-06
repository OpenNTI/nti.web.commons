/* eslint-env jest */
import React from 'react';
import ReactDOM from 'react-dom';

import Flyout from '../Triggered';

const spyOn = (...args) => jest.spyOn(...args);

//We cannot currently get around not using this method...
//there are other test utils that allow better component access to tests.
const getDom = cmp => ReactDOM.findDOMNode(cmp); //eslint-disable-line
const getText = cmp => getDom(cmp).textContent;

const render = (node, cmp, props = {}, ...children) => new Promise(next => {
	let ref;
	ReactDOM.render(
		React.createElement(cmp, {...props, ref (x) {ref = x; props.ref && props.ref(x);}}, ...children),
		node,
		() => next(ref)
	);
});

describe('Triggered Flyout', () => {
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

	beforeAll(()=> {
		document.scrollingElement = window; //jest's jsdom env doesn't define this
		jest.restoreAllMocks();
	});

	afterAll(()=> {
		delete document.scrollingElement;
		ReactDOM.unmountComponentAtNode(container);
		document.body.removeChild(container);
	});

	const testRender = (props, ...children) => [
		render(newNode, Flyout, props, ...children),
		render(container, Flyout, props, ...children)
	];

	setup();

	test('Base Case', async () => {
		const cmps = await Promise.all(testRender());

		cmps.map(getText)
			.forEach(x => expect(x).toEqual('Trigger'));
	});

	test('Base Case: Specify Trigger', async () => {
		const value = 'Test';

		const cmps = await Promise.all(testRender({trigger: 'input', type: 'button', value}));

		cmps.map(getDom)
			.forEach(x => {
				expect(x.tagName).toEqual('INPUT');
				expect(x.value).toEqual(value);
			});
	});

	test('Base Case: Specify Element Trigger', async () => {
		const value = 'Test';
		const element = (
			<a href="#test" className="foobar">{value}</a>
		);

		const cmps = await Promise.all(testRender({trigger: element}));

		cmps.map(getDom)
			.forEach(x => {
				expect(x.tagName).toEqual('A');
				expect(x.getAttribute('href')).toEqual('#test');
				expect(x.classList.contains('foobar')).toBeTruthy();
				expect(x.textContent).toEqual(value);
			});
	});

	test('Opening the flyout should add listeners to window, and document', async () => {
		spyOn(window, 'addEventListener');
		spyOn(window, 'removeEventListener');
		spyOn(window.document, 'addEventListener');
		spyOn(window.document, 'removeEventListener');

		let step = null;

		function afterAlign () {
			step();
		}

		const [component] = await Promise.all(testRender({afterAlign}, <div>Foobar</div>));

		await new Promise(next =>{
			step = next;
			component.onToggle();
		});

		expect(window.addEventListener).toHaveBeenCalledWith('resize', component.realign);
		// expect(window.addEventListener).toHaveBeenCalledWith('scroll', component.realign);
		expect(window.document.addEventListener).toHaveBeenCalledWith('click', component.maybeDismiss);
	});

	test('Closing the flyout should remove listeners to window, and document', async () => {
		spyOn(window, 'addEventListener');
		spyOn(window, 'removeEventListener');
		spyOn(window.document, 'addEventListener');
		spyOn(window.document, 'removeEventListener');

		let step = null;

		function afterAlign () {
			step();
		}

		const [component] = await Promise.all(testRender({afterAlign}, <div>Foobar2</div>));

		await new Promise(next =>{
			step = next;
			component.onToggle();
		});

		await new Promise(next =>{
			component.onToggle(null, next);
		});

		expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
		// expect(window.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
		expect(window.document.removeEventListener).toHaveBeenCalledWith('click', expect.any(Function));
	});

	test('Flys echo classnames', async () => {
		const cmps = await Promise.all(testRender({className: 'awesome sauce'}, <div>Lala</div> ));
		await Promise.all(cmps.map(x => new Promise(next => x.onToggle(null, next))));

		for (let c of cmps) {
			expect(c.state.open).toBeTruthy();
			expect(c.fly.className).toEqual('fly-wrapper awesome sauce');
			expect(c.flyout.className).toEqual('flyout awesome sauce bottom center');
			expect(c.flyout.textContent).toEqual('Lala');
			expect(c.fly.contains(c.flyout)).toBeTruthy();
		}

	});
});
