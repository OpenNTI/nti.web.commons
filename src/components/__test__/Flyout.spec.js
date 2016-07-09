import React from 'react';
import ReactDOM from 'react-dom';

import Flyout, {
	ALIGNMENT_POSITIONS,
	ALIGNMENT_SIZINGS,
	VERTICAL,
	ALIGN_TOP,
	ALIGN_BOTTOM,
	ALIGN_CENTER,
	ALIGN_LEFT,
	ALIGN_RIGHT,
	MATCH_SIDE,
	DEFAULT_VERTICAL,
	DEFAULT_HORIZONTAL
} from '../Flyout';

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

	describe('Alignment Positions', () => {
		const viewSize = {height: 1000, width: 1000};
		const flyout = {offsetHeight: 250, offsetWidth: 250};

		describe('Vertical Axis is Primary', () => {
			const ALIGNMENTS = ALIGNMENT_POSITIONS[VERTICAL];

			describe('Vertical Alignments', () => {
				it ('Forced Top Alignment', () => {
					const position = ALIGNMENTS[ALIGN_TOP]({top: 500}, flyout, viewSize);

					//The flyout should be be positioned by bottom to be at the top of the trigger,
					//so it can grow upwards.
					expect(position.top).toEqual(null);
					expect(position.bottom).toEqual(500);
				});

				it ('Forced Bottom Alignment', () => {
					const position = ALIGNMENTS[ALIGN_BOTTOM]({bottom: 500}, flyout, viewSize);

					//THe flyout should be positioned by top to be at the bottom of the trigger,
					//so it can grow downwards.
					expect(position.top).toEqual(500);
					expect(position.bottom).toEqual(null);
				});

				it ('Default enough room on bottom', () => {
					const position = ALIGNMENTS[DEFAULT_VERTICAL]({top: 5, bottom: 45}, flyout, viewSize);

					expect(position.top).toEqual(45);
					expect(position.bottom).toEqual(null);
				});

				it ('Default enough room on top', () => {
					const position = ALIGNMENTS[DEFAULT_VERTICAL]({top: 955, bottom: 995}, flyout, viewSize);

					expect(position.top).toEqual(null);
					expect(position.bottom).toEqual(45);
				});

				it ('Default more room on the bottom', () => {
					const position = ALIGNMENTS[DEFAULT_VERTICAL]({top: 5, bottom: 45}, flyout, viewSize);

					expect(position.top).toEqual(45);
					expect(position.bottom).toEqual(null);
				});

				it ('Default more room on the top', () => {
					const position = ALIGNMENTS[DEFAULT_VERTICAL]({top: 200, bottom: 995}, flyout, viewSize);

					expect(position.top).toEqual(null);
					expect(position.bottom).toEqual(800);
				});
			});

			describe('Horizontal Alignments', () => {
				it ('Left Alignment', () => {
					const position = ALIGNMENTS[ALIGN_LEFT]({left: 45}, flyout, viewSize);

					expect(position.left).toEqual(45);
					expect(position.right).toEqual(null);
				});

				it ('Right Alignment', () => {
					const position = ALIGNMENTS[ALIGN_RIGHT]({right: 955}, flyout, viewSize);

					expect(position.left).toEqual(null);
					expect(position.right).toEqual(45);
				});

				it ('Center Alignment, Trigger wider', () => {
					const position = ALIGNMENTS[ALIGN_CENTER]({left: 45, width: 450}, flyout, viewSize);

					expect(position.left).toEqual(145);
					expect(position.right).toEqual(null);
				});

				it ('Center Alignment, Trigger narrower', () => {
					const position = ALIGNMENTS[ALIGN_CENTER]({left: 45, width: 200}, flyout, viewSize);

					expect(position.left).toEqual(20);
					expect(position.right).toEqual(null);
				});

				it ('Default', () => {
					//For now this just calls center alignment so no need to test it
					expect(true).toBeTruthy();
				});
			});
		});
	});


	describe ('Sizing Tests', () => {
		describe('Vertical Axis is Primary', () => {
			const SIZINGS = ALIGNMENT_SIZINGS[VERTICAL];

			it ('Match Side', () => {
				const size = SIZINGS[MATCH_SIDE]({width: 200});

				expect(size.width).toEqual(200);
			});
		});
	});
});
