import React from 'react';
import ReactDOM from 'react-dom';

import Flyout from '../Flyout';

const getDom = cmp => ReactDOM.findDOMNode(cmp);
const getText = cmp => getDom(cmp).textContent;

const render = (node, cmp, props = {}, ...children) => new Promise(next =>
	void ReactDOM.render(
		React.createElement(cmp, {...props, ref (x) {cmp = x; props.ref && props.ref(x);}}, ...children),
		node,
		() => next(cmp)
	));

describe('Flyout', () => {
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
		render(newNode, Flyout, props, ...children),
		render(container, Flyout, props, ...children)
	];

	setup();

	it('Base Case', (done) => {
		Promise.all(test())
			.then(cmps => cmps
					.map(getText)
					.forEach(x => expect(x).toEqual('Trigger')))
			.then(done, e => done.fail(e));
	});

	it('Base Case: Specify Trigger', (done) => {
		const value = 'Test';
		Promise.all(test({trigger: 'input', type: 'button', value}))
			.then(cmps => cmps
				.map(getDom)
				.forEach(x => {
					expect(x.tagName).toEqual('INPUT');
					expect(x.value).toEqual(value);
				})
			)
			.then(done, e => done.fail(e));
	});

	it('Base Case: Specify Element Trigger', (done) => {
		const value = 'Test';
		const element = (
			<a href="#test" className="foobar">{value}</a>
		);

		Promise.all(test({trigger: element}))
			.then(cmps => cmps
				.map(getDom)
				.forEach(x => {
					expect(x.tagName).toEqual('A');
					expect(x.getAttribute('href')).toEqual('#test');
					expect(x.className).toEqual('foobar');
					expect(x.textContent).toEqual(value);
				})
			)
			.then(done, e => done.fail(e));
	});

	it('Opening the flyout should add listeners to window, and document', (done) => {
		spyOn(window, 'addEventListener');
		spyOn(window, 'removeEventListener');
		spyOn(window.document, 'addEventListener');
		spyOn(window.document, 'removeEventListener');

		let step = null;

		function afterAlign () {
			step();
		}

		Promise.all(test({afterAlign}, <div>Foobar</div>))
			.then(([component]) => new Promise(next =>{

				step = () => {
					expect(window.addEventListener).toHaveBeenCalledWith('resize', component.realign);
					expect(window.addEventListener).toHaveBeenCalledWith('scroll', component.realign);
					expect(window.document.addEventListener).toHaveBeenCalledWith('click', component.maybeDismiss);
					next();
				};

				component.onToggle();
			}))
			.then(done, e => done.fail(e));
	});

	it('Closing the flyout should remove listeners to window, and document', (done) => {
		spyOn(window, 'addEventListener');
		spyOn(window, 'removeEventListener');
		spyOn(window.document, 'addEventListener');
		spyOn(window.document, 'removeEventListener');


		let step = null;

		function afterAlign () {
			step();
		}

		Promise.all(test({afterAlign}, <div>Foobar2</div>))
			.then(([component]) => new Promise(next => {

				step = () => {
					component.onToggle(null, () => {
						expect(window.removeEventListener).toHaveBeenCalledWith('resize', component.realign);
						expect(window.removeEventListener).toHaveBeenCalledWith('scroll', component.realign);
						expect(window.document.removeEventListener).toHaveBeenCalledWith('click', component.maybeDismiss);
						next();
					});
				};

				component.onToggle();
			}))
			.then(done, e => done.fail(e));
	});

	it('Flys echo classnames', (done) => {

		Promise.all(test({className: 'awesome sauce'}, <div>Lala</div> ))
			.then(cmps => Promise.all(cmps
				.map(x => new Promise(next => x.onToggle(null, ()=> next(x))))
			))
			.then(components => {

				for (let c of components) {
					expect(c.state.open).toBeTruthy();
					expect(c.fly.className).toEqual('fly-wrapper awesome sauce');
					expect(c.flyout.className).toEqual('flyout awesome sauce left bottom');
					expect(c.flyout.textContent).toEqual('Lala');
					expect(c.fly.contains(c.flyout)).toBeTruthy();
				}

				done();
			})
			.catch(x => done.fail(x));

	});

	describe('Flys honor alignments:', () => {
		setup();

		for (let vert of ['top', 'middle', 'bottom']) {
			for (let horz of ['left', 'center', 'right']) {

				it (`Align: ${vert}-${horz}`, (done) => {
					Promise.all(test({alignment: `${vert}-${horz}`}))
						.then(cmps => Promise.all(cmps
							.map(x => new Promise(next =>
								x.maybeDismiss(null, () =>
									x.onToggle(null,
										//We need to call align ourselves because we need to know when it finishes
										()=> x.align(()=> next(x), true)
									)
								)
							))
						))
						.then(components => {
							for (let c of components) {

								expect(c.flyout.className).toEqual(`flyout ${horz} ${vert}`);

							}
						})
						.then(done)
						.catch(x => done.fail((x.stack || x)));
				});
			}
		}

	});
});
