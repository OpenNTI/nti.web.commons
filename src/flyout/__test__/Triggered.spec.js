/* eslint-env jest */
/* eslint-disable no-console */
jest.mock('react-dom', () => require('../../__mocks__/react-dom.disabled'));

import React from 'react';

import {verify} from '../../__test__/utils';
import Flyout, { getViewportRelativeAlignments } from '../Triggered';

const createNodeMock = ({type}) => document.createElement(type);

Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
	get () { return this.parentNode; },
});

describe('Triggered Flyout', () => {

	beforeAll(()=> {
		document.body.innerHTML = '';
		document.scrollingElement = window; //jest's jsdom env doesn't define this
		jest.restoreAllMocks();
	});


	afterAll(()=> {
		delete document.scrollingElement;
	});


	test('Base Case', () => {
		const renderer = verify(<Flyout/>);
		const {fly} = renderer.getInstance();
		renderer.unmount();
		expect(document.contains(fly)).toBeFalsy();
	});


	test('Children recieve onDismiss prop', () => {
		const Mock = jest.fn(() => <div/>);
		verify(
			<Flyout open>
				<Mock/>
			</Flyout>,
			{createNodeMock}
		);

		expect(Mock).toHaveBeenCalledWith(
			expect.objectContaining({
				onDismiss: expect.any(Function),
			}),
			expect.anything()
		);
	});


	test('Realigns when flyout size changes', () => {
		jest.useFakeTimers();
		const renderer = verify(
			<Flyout open>
				<div style={{width: 100, height: 100}}></div>
			</Flyout>,
			{createNodeMock (ref) {
				// jsdom doesn't do layout...so fake it
				const {type, props: {...props}} = ref;
				delete props.children;
				delete props.style;
				const el = Object.assign(document.createElement(type), props);

				function measure (node, dim) {
					if (!node) {
						return 0;
					}

					const {style, children} = node.props || {};
					const c = Array.isArray(children) ? children : [children];

					const value = parseInt((style || {})[dim], 10) || 0;

					return c.map(x => measure(x, dim) + value).reduce((x, i) => x + i, 0);
				}

				function getFlyout () {
					try {
						return renderer.root.find(({props: {style: x} = {}}) => x && 'width' in x && 'height' in x);
					} catch {
						// invoked before renderer is initialized (first-ish render pass)
						return ref;
					}
				}

				//jsdom doesn't calculate layout values... so we need to mock it.
				Object.defineProperties(el, {
					offsetHeight: { get: () => measure(getFlyout(), 'height') },
					offsetWidth: { get: () => measure(getFlyout(), 'width') }
				});

				return el;
			}}
		);

		const inst = renderer.getInstance();

		jest.spyOn(inst, 'realign');

		renderer.update(
			<Flyout open>
				<div style={{width: 200, height: 200}}></div>
			</Flyout>
		);

		jest.runAllTimers();

		expect(inst.realign).toHaveBeenCalled();
	});


	test('Controlled', () => {
		const renderer = verify(
			<Flyout open={false}>
				<div>My Flyout Content</div>
			</Flyout>,
			{createNodeMock}
		);


		renderer.update(
			<Flyout open={true} arrow>
				<div>My Flyout Content</div>
				<div>My New Flyout Content</div>
			</Flyout>
		);


		expect(renderer.toJSON()).toMatchSnapshot();

		const fn = jest.fn();
		renderer.update(
			<Flyout open={false} className="new" trigger={<div />} onDismiss={fn}>
				<div>My New New New New New New New New New New New New New Flyout Content</div>
			</Flyout>
		);

		expect(fn).toHaveBeenCalled();
		expect(renderer.toJSON()).toMatchSnapshot();

		jest.spyOn(console, 'warn').mockImplementation(() => {});
		renderer.update(
			<Flyout className="new"/>
		);

		expect(console.warn).toHaveBeenCalledWith(expect.stringMatching('controlled to uncontrolled'));

		renderer.unmount();

	});


	test('defaultState', () => {
		verify(
			<Flyout defaultState="open">
				<div>My Flyout Content</div>
			</Flyout>,
			{createNodeMock}
		).unmount();
	});


	test('hover over trigger opens flyout', () => {
		jest.useFakeTimers();
		const renderer = verify(<Flyout hover><div/></Flyout>, {
			createNodeMock (ref) {
				const el = createNodeMock(ref);
				const {onMouseEnter, onMouseLeave} = ref.props;
				if (onMouseEnter) {el.addEventListener('mouseenter', onMouseEnter);}
				if (onMouseLeave) {el.addEventListener('mouseleave', onMouseLeave);}
				return el;
			}
		});

		const inst = renderer.getInstance();
		jest.spyOn(inst, 'startShow');
		jest.spyOn(inst, 'startHide');
		jest.spyOn(inst, 'stopHide');

		expect(inst.hoverTimeouts).toMatchSnapshot();

		renderer.update( <Flyout hover={{openTimeout: 1, closeTimeout: 2}}><div/></Flyout> );
		expect(inst.hoverTimeouts).toMatchSnapshot();

		inst.trigger.dispatchEvent(new MouseEvent('mouseenter'));
		jest.runAllTimers();
		expect(inst.startShow).toHaveBeenCalled();
		expect(inst.startHide).not.toHaveBeenCalled();

		inst.trigger.dispatchEvent(new MouseEvent('mouseleave'));
		jest.runAllTimers();
		inst.startShow.mockReset();
		expect(inst.startShow).not.toHaveBeenCalled();
		expect(inst.startHide).toHaveBeenCalled();
	});


	test('mouse out of flyout closes', () => {
		jest.useFakeTimers();
		const renderer = verify(<Flyout hover><div/></Flyout>, {
			createNodeMock (ref) {
				const el = createNodeMock(ref);
				const {onMouseEnter, onMouseLeave} = ref.props;
				if (onMouseEnter) {el.addEventListener('mouseenter', onMouseEnter);}
				if (onMouseLeave) {el.addEventListener('mouseleave', onMouseLeave);}
				document.body.append(el);
				return el;
			}
		});

		const inst = renderer.getInstance();

		jest.spyOn(inst, 'startHide');
		jest.spyOn(inst, 'stopHide');

		inst.doOpen();
		jest.runAllTimers();

		inst.flyout.dispatchEvent(new MouseEvent('mouseenter'));
		expect(inst.stopHide).toHaveBeenCalled();

		inst.flyout.dispatchEvent(new MouseEvent('mouseleave'));
		expect(inst.startHide).toHaveBeenCalled();

		jest.runAllTimers();
	});


	test('maybeDismiss()', () => {
		const renderer = verify( <Flyout defaultState="open"><div/></Flyout>, {createNodeMock});

		const inst = renderer.getInstance();

		const fn = jest.fn();
		jest.spyOn(inst, 'dismiss');

		inst.maybeDismiss(null, fn);

		expect(inst.dismiss).toHaveBeenCalled();
		expect(fn).toHaveBeenCalled();

		inst.dismiss.mockClear();

		inst.doOpen();
		inst.maybeDismiss({target: inst.trigger});
		expect(inst.dismiss).not.toHaveBeenCalled();

		inst.doOpen();
		inst.maybeDismiss({target: document.body});
		expect(inst.dismiss).toHaveBeenCalled();
	});


	test('alignment shorts if closed', () => {
		const renderer = verify( <Flyout />, {createNodeMock});

		const inst = renderer.getInstance();

		jest.spyOn(inst, 'setState');
		const {alignment} = inst.state;

		inst.align();

		expect(inst.setState).toHaveBeenCalledWith({aligning: false, alignment}, undefined);
	});


	test('Transition Support', () => {
		jest.useFakeTimers();
		const renderer = verify( <Flyout transition={{className: 'fade', timeout: 500}} />, {createNodeMock});
		const inst = renderer.getInstance();

		expect(inst.state).toEqual({alignment: {}});

		inst.doOpen();

		expect(renderer.toJSON()).toMatchSnapshot();
		expect(inst.state).toEqual({
			aligning: false,
			alignment: expect.anything(),
			closing: false,
			open: true,
			opening: true,
		});

		jest.runAllTimers();

		expect(renderer.toJSON()).toMatchSnapshot();
		expect(inst.state).toEqual({
			aligning: false,
			alignment: expect.anything(),
			closing: false,
			open: true,
			opening: false,
		});

		inst.doClose();

		expect(renderer.toJSON()).toMatchSnapshot();
		expect(inst.state).toEqual({
			aligning: false,
			alignment: expect.anything(),
			closing: true,
			open: true,
			opening: false,
		});

		jest.runAllTimers();

		expect(renderer.toJSON()).toMatchSnapshot();
		expect(inst.state).toEqual({
			aligning: true,
			alignment: expect.anything(),
			closing: false,
			open: false,
			opening: false,
		});
	});


	test('scrolling realigns', () => {
		let listener;
		jest.spyOn(document, 'addEventListener')
			.mockImplementation((evName, handler) => listener = handler);


		const renderer = verify( <Flyout open/>, {
			createNodeMock ({type}) {
				const el = document.createElement(type);

				document.body.appendChild(el);
				return el;
			}
		});

		expect(document.addEventListener).toHaveBeenCalled();

		const inst = renderer.getInstance();
		jest.spyOn(inst, 'realign');

		listener({target: {contains: () => false}});
		expect(inst.realign).not.toHaveBeenCalled();

		listener({target: document});

		expect(inst.realign).toHaveBeenCalled();
	});


	test('clicking the flyout sets flag', () => {
		const renderer = verify( <Flyout />, {createNodeMock});

		const inst = renderer.getInstance();
		jest.spyOn(inst, 'flyoutClicked');

		inst.doOpen();

		document.body.appendChild(inst.flyout);

		inst.flyout.dispatchEvent(new MouseEvent('click', {
			view: document.defaultView,
			bubbles: true,
			cancelable: true
		}));

		expect(inst.flyoutClicked).toHaveBeenCalled();
	});


	test('constrained alignment does not limit height for non-top-aligned, non-fixed flyouts', () => {
		jest.useFakeTimers();
		const renderer = verify( <Flyout constrain open verticalAlign={Flyout.ALIGNMENTS.BOTTOM}><div/></Flyout>, {createNodeMock});

		const inst = renderer.getInstance();

		inst.align();

		jest.runAllTimers();

		expect(inst.state.alignment).not.toHaveProperty('maxHeight');
	});


	test('zIndex resolition', () => {
		document.body.innerHTML = `
			<div>
				<div class="foo" style="z-index: 10; position: absolute; top:100px; left:100px;"></div>
			</div>
		`;

		const div = document.body.querySelector('div.foo');

		const renderer = verify(
			<Flyout open constrain>
				<div>My Flyout Content</div>
			</Flyout>,
			{createNodeMock ({type}) {
				const el = document.createElement(type);
				//the default trigger is a button.
				if (type === 'button') {
					div.appendChild(el);
				}
				return el;
			}}
		);

		const flyout = renderer.root.find(({type, props}) =>
			type === 'div'
			&& props.style != null
			&& props.className
			&& props.className.split(' ').filter(RegExp.prototype.test.bind(/opened|flyout/)).length === 2
		);

		expect(flyout.props.style.zIndex).toBe(11);
	});


	test('position fixed resolition', () => {
		document.body.innerHTML = `
			<div>
				<div class="foo" style="z-index: 10; position: fixed; top:100px; left:100px;"></div>
			</div>
		`;

		const div = document.body.querySelector('div.foo');

		const renderer = verify(
			<Flyout open constrain>
				<div>My Flyout Content</div>
			</Flyout>,
			{createNodeMock ({type}) {
				const el = document.createElement(type);
				//the default trigger is a button.
				if (type === 'button') {
					div.appendChild(el);
				}
				return el;
			}}
		);

		const flyout = renderer.root.find(({type, props}) =>
			type === 'div'
			&& props.style != null
			&& props.className
			&& props.className.split(' ').filter(RegExp.prototype.test.bind(/opened|flyout/)).length === 2
		);

		expect(flyout.props.style.position).toBe('fixed');
	});


	test('Trigger Click Handlers', () => {
		const fn = jest.fn();
		const renderer = verify(
			<Flyout trigger={<div className="custom-trigger" onClick={fn}/>}>
				<div>My Flyout Content</div>
			</Flyout>,
			{createNodeMock}
		);

		const div = renderer.root.find(x => /custom-trigger/.test(x.props.className));
		div.props.onClick();

		expect(fn).toHaveBeenCalled();
	});


	test('Specify Trigger', () => {
		verify(<Flyout trigger="input" type="button" value="Test"/>);
	});


	test('Specify Element Trigger', async () => {
		verify(<Flyout trigger={<a href="#test">Test</a>} value="Test"/>);
	});


	test('[Non-forwarded-refs] Warns for Stateless component triggers', async () => {
		const MyTrigger = () => <a href="#test">Test</a>;

		jest.spyOn(console, 'warn').mockImplementation(() => {});
		jest.spyOn(console, 'error').mockImplementation(() => {});

		const renderer = verify(<Flyout trigger={MyTrigger}/>, {createNodeMock});

		expect(renderer.getInstance().trigger).toBeFalsy();

		expect(console.error).toHaveBeenCalledWith(
			expect.stringMatching('Warning: Stateless function components cannot be given refs. Attempts to access this ref will fail.%s%s'),
			expect.anything(),
			expect.anything());
		expect(console.warn).toHaveBeenCalledWith(
			expect.stringMatching('A Stateless Component null ref was returned for the Trigger'),
			expect.anything(),
			expect.anything());

		console.error.mockClear();
		console.warn.mockClear();

		expect(renderer.getInstance().trigger).toBeFalsy();
		expect(console.error).not.toHaveBeenCalled();
		expect(console.warn).not.toHaveBeenCalled();
		console.error.mockClear();
		console.warn.mockClear();

		const renderer2 = verify(<Flyout trigger={<MyTrigger/>}/>, {createNodeMock});

		expect(renderer2.getInstance().trigger).toBeFalsy();

		expect(console.error).toHaveBeenCalledWith(
			expect.stringMatching('Warning: Stateless function components cannot be given refs. Attempts to access this ref will fail.%s%s'),
			expect.anything(),
			expect.anything());
		expect(console.warn).toHaveBeenCalledWith(
			expect.stringMatching('A Stateless Component null ref was returned for the Trigger'),
			expect.anything(),
			expect.anything());

		console.error.mockClear();
		console.warn.mockClear();

		expect(renderer2.getInstance().trigger).toBeFalsy();
		expect(console.error).not.toHaveBeenCalled();
		expect(console.warn).not.toHaveBeenCalled();
	});


	test('[Non-forwarded-refs] Warns for Component triggers that do not implement getDOMNode()', async () => {
		class MyTrigger extends React.Component {
			render () { return <a href="#test">Test</a>; }
		}
		jest.useFakeTimers();
		jest.spyOn(console, 'warn').mockImplementation(() => {});
		jest.spyOn(console, 'error').mockImplementation(() => {});

		const renderer = verify(<Flyout trigger={MyTrigger}/>, {createNodeMock});

		expect(renderer.getInstance().trigger).toBeFalsy();

		jest.runAllTimers();

		expect(console.error).not.toHaveBeenCalled();
		expect(console.warn).toHaveBeenCalledWith(
			expect.stringMatching('A Component ref was returned for the Trigger'),
			expect.anything(),
			expect.anything(),
			expect.anything());

		console.error.mockClear();
		console.warn.mockClear();

		expect(renderer.getInstance().trigger).toBeFalsy();
		expect(console.error).not.toHaveBeenCalled();
		expect(console.warn).not.toHaveBeenCalled();
		console.error.mockClear();
		console.warn.mockClear();

		const renderer2 = verify(<Flyout trigger={<MyTrigger/>}/>, {createNodeMock});

		expect(renderer2.getInstance().trigger).toBeFalsy();
		jest.runAllTimers();
		expect(console.error).not.toHaveBeenCalled();
		expect(console.warn).toHaveBeenCalledWith(
			expect.stringMatching('A Component ref was returned for the Trigger'),
			expect.anything(),
			expect.anything(),
			expect.anything());

		console.error.mockClear();
		console.warn.mockClear();

		expect(renderer2.getInstance().trigger).toBeFalsy();
		expect(console.error).not.toHaveBeenCalled();
		expect(console.warn).not.toHaveBeenCalled();
	});


	test('[Non-forwarded-refs] Component trigger.getDOMNode() returns node', async () => {
		class MyTrigger extends React.Component {
			ref = React.createRef()
			getDOMNode = () => this.ref.current;
			render () { return <a href="#test" ref={this.ref}>Test</a>; }
		}

		const renderer = verify(<Flyout trigger={MyTrigger}/>, {createNodeMock});

		expect(renderer.getInstance().trigger).toBeInstanceOf(Element);


	});


	test('Ref is not dropped from custom trigger', () => {
		jest.useFakeTimers();
		const ref = jest.fn();
		verify(<Flyout trigger={<a href="#test" ref={ref}>Test</a>} value="Test"/>, {createNodeMock});

		jest.runAllTimers();

		expect(ref).toHaveBeenCalled();
	});


	test('Opening the flyout should add listeners to window, and document', async () => {
		jest.spyOn(window, 'addEventListener');
		jest.spyOn(window, 'removeEventListener');
		jest.spyOn(window.document, 'addEventListener');
		jest.spyOn(window.document, 'removeEventListener');

		let step = null;

		function afterAlign () {
			step();
		}

		const renderer = verify(
			<Flyout afterAlign={afterAlign}>
				<div>Foobar</div>
			</Flyout>,
			{createNodeMock}
		);

		const component = renderer.getInstance();
		const event = {
			isPropagationStopped: () => false,
			preventDefault: jest.fn(),
			stopPropagation: jest.fn(),
		};

		await new Promise(next =>{
			step = next;
			component.onToggle(event);
		});

		expect(event.preventDefault).toHaveBeenCalled();
		expect(event.stopPropagation).toHaveBeenCalled();

		expect(window.addEventListener).toHaveBeenCalledWith('resize', component.realign);
		// expect(window.addEventListener).toHaveBeenCalledWith('scroll', component.realign);
		expect(window.document.addEventListener).toHaveBeenCalledWith('click', component.maybeDismiss);


		jest.spyOn(component, 'doClose');
		jest.spyOn(component, 'doOpen');
		event.isPropagationStopped = () => true;
		event.preventDefault.mockClear();
		event.stopPropagation.mockClear();

		component.onToggle(event);

		expect(component.doClose).not.toHaveBeenCalled();
		expect(component.doOpen).not.toHaveBeenCalled();
		expect(event.stopPropagation).not.toHaveBeenCalled();
		expect(event.preventDefault).not.toHaveBeenCalled();
	});


	test('Closing the flyout should remove listeners to window, and document', async () => {
		jest.spyOn(window, 'addEventListener');
		jest.spyOn(window, 'removeEventListener');
		jest.spyOn(window.document, 'addEventListener');
		jest.spyOn(window.document, 'removeEventListener');

		let step = null;

		function afterAlign () {
			step();
		}

		const renderer = verify(
			<Flyout afterAlign={afterAlign}>
				<div>Foobar2</div>
			</Flyout>,
			{createNodeMock}
		);

		const component = renderer.getInstance();

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

		const renderer = verify(
			<Flyout className="awesome sauce">
				<div>Lala</div>
			</Flyout>,
			{createNodeMock}
		);

		const component = renderer.getInstance();

		await new Promise(next => component.onToggle(null, next));

		expect(renderer.toJSON()).toMatchSnapshot();
	});


	test('getViewportRelativeAlignments', () => {
		const viewport = {width: 1024, height: 768};

		document.body.innerHTML = `
			<div>
				<div id=target></div>
			</div>
		`;
		const div = document.getElementById('target');
		Object.defineProperty(div, 'getBoundingClientRect', {value: () => ({
			top: 100,
			left: 50,
			bottom: 700,
			right: 250,
			width: 200,
			height: 600,
		})});

		expect(getViewportRelativeAlignments(div, {}, viewport)).toMatchSnapshot();
		expect(getViewportRelativeAlignments(div, {top: 1, left: 1, right: 1, bottom: 1}, viewport)).toMatchSnapshot();
		expect(getViewportRelativeAlignments(div, {top: 1, left: 1}, viewport)).toMatchSnapshot();
		expect(getViewportRelativeAlignments(div, {bottom: 1, right: 1}, viewport)).toMatchSnapshot();
		expect(getViewportRelativeAlignments(div, {top: 1}, viewport)).toMatchSnapshot();
		expect(getViewportRelativeAlignments(div, {bottom: 1}, viewport)).toMatchSnapshot();
		expect(getViewportRelativeAlignments(div, {left: 1}, viewport)).toMatchSnapshot();
		expect(getViewportRelativeAlignments(div, {right: 1}, viewport)).toMatchSnapshot();
	});
});
