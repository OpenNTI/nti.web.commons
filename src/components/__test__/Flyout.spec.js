import React from 'react';
import ReactDOM from 'react-dom';

import Flyout from '../Flyout';

const getDom = cmp => ReactDOM.findDOMNode(cmp);
const getText = cmp => getDom(cmp).textContent;

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
		ReactDOM.render(
			React.createElement(Flyout, props, ...children),
			newNode
		),

		ReactDOM.render(
			React.createElement(Flyout, props, ...children),
			container
		)
	];

	setup();

	it('Base Case', () => {
		test()
			.map(getText)
			.forEach(x => expect(x).toEqual('Trigger'));
	});

	it('Base Case: Specify Trigger', () => {
		const value = 'Test';
		test({trigger: 'input', type: 'button', value})
			.map(getDom)
			.forEach(x => {
				expect(x.tagName).toEqual('INPUT');
				expect(x.value).toEqual(value);
			});
	});

	it('Base Case: Specify Element Trigger', () => {
		const value = 'Test';
		const element = (
			<a href="#test" className="foobar">{value}</a>
		);

		test({trigger: element})
			.map(getDom)
			.forEach(x => {
				expect(x.tagName).toEqual('A');
				expect(x.getAttribute('href')).toEqual('#test');
				expect(x.className).toEqual('foobar');
				expect(x.textContent).toEqual(value);
			});
	});

	it('Opening the flyout should add listeners to window, and document', (done) => {
		spyOn(window, 'addEventListener');
		spyOn(window, 'removeEventListener');
		spyOn(window.document, 'addEventListener');
		spyOn(window.document, 'removeEventListener');

		const [component] = test({afterAlign},
			<div>
				Foobar
			</div>
		);

		function afterAlign () {
			expect(window.addEventListener).toHaveBeenCalledWith('resize', component.realign);
			expect(window.addEventListener).toHaveBeenCalledWith('scroll', component.realign);
			expect(window.document.addEventListener).toHaveBeenCalledWith('click', component.maybeDismiss);
			done();
		}

		component.onToggle();
	});

	it('Closing the flyout should remove listeners to window, and document', (done) => {
		spyOn(window, 'addEventListener');
		spyOn(window, 'removeEventListener');
		spyOn(window.document, 'addEventListener');
		spyOn(window.document, 'removeEventListener');

		const [component] = test({afterAlign},
			<div>
				Foobar2
			</div>
		);

		function afterAlign () {
			component.onToggle(null, () => {
				expect(window.removeEventListener).toHaveBeenCalledWith('resize', component.realign);
				expect(window.removeEventListener).toHaveBeenCalledWith('scroll', component.realign);
				expect(window.document.removeEventListener).toHaveBeenCalledWith('click', component.maybeDismiss);
				done();
			});
		}

		component.onToggle();
	});

	it('Flys echo classnames', (done) => {

		Promise.all(
			test({className: 'awesome sauce'}, <div>Lala</div> )
				.map(x => new Promise(next => {
					setTimeout(()=>
						x.onToggle(null, ()=> next(x)), 10);
				}))
		)
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
			.catch(x => done.fail('Failed: ' + (x.stack || x)));

	});

	describe('Flys honor alignments:', () => {
		setup();

		for (let vert of ['top', 'middle', 'bottom']) {
			for (let horz of ['left', 'center', 'right']) {

				it (`Align: ${vert}-${horz}`, (done) => {
					Promise.all(
						test({alignment: `${vert}-${horz}`})
							.map(x => new Promise(next =>
								x.onToggle(null,
									//We need to call align ourselves because we need to know when it finishes
									()=> x.align(()=> next(x), true)
								)
							)
						)
					)
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
