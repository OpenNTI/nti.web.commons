/* eslint-env jest */
/* eslint-disable no-console */
jest.mock('react-dom', () => require('../../__mocks__/react-dom.disabled'));

import React from 'react';

import { verify } from '../../__test__/utils';
import Flyout from '../Triggered';
import Aligned from '../Aligned';

const createNodeMock = ({ type }) => document.createElement(type);

Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
	get() {
		return this.parentNode;
	},
});

describe('Triggered Flyout', () => {
	beforeAll(() => {
		document.body.innerHTML = '';
		document.scrollingElement = window; //jest's jsdom env doesn't define this
		jest.restoreAllMocks();
	});

	afterAll(() => {
		delete document.scrollingElement;
	});

	test('Base Case', () => {
		const renderer = verify(<Flyout />);
		const { fly } = renderer.getInstance();
		renderer.unmount();
		expect(document.contains(fly)).toBeFalsy();
	});

	test('Children recieve onDismiss prop (renderContent) ', async () => {
		const Mock = jest.fn(() => <div />);
		const renderer = verify(
			<Flyout open>
				<Mock />
			</Flyout>,
			{ createNodeMock }
		);

		const content = renderer.getInstance().renderContent();

		expect(content.props.onDismiss).toEqual(expect.any(Function));
	});

	test('Controlled', () => {
		const renderer = verify(
			<Flyout open={false}>
				<div>My Flyout Content</div>
			</Flyout>,
			{ createNodeMock }
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
			<Flyout
				open={false}
				className="new"
				trigger={<div />}
				onDismiss={fn}
			>
				<div>
					My New New New New New New New New New New New New New
					Flyout Content
				</div>
			</Flyout>
		);

		expect(fn).toHaveBeenCalled();
		expect(renderer.toJSON()).toMatchSnapshot();

		// jest.spyOn(console, 'warn').mockImplementation(() => {});
		// renderer.update(
		// 	<Flyout className="new"/>
		// );

		// expect(console.warn).toHaveBeenCalledWith(expect.stringMatching('controlled to uncontrolled'));

		renderer.unmount();
	});

	test("Controlled doesn't auto dismiss", () => {
		const renderer = verify(
			<Flyout open={true} trigger={<div />}>
				<div>Flyout Content</div>
			</Flyout>,
			{ createNodeMock }
		);

		const instance = renderer.getInstance();

		jest.spyOn(instance, 'setState');

		instance.doClose();

		expect(instance.setState).not.toHaveBeenCalled();
	});

	test('defaultState', () => {
		verify(
			<Flyout defaultState="open">
				<div>My Flyout Content</div>
			</Flyout>,
			{ createNodeMock }
		).unmount();
	});

	test('hover over trigger opens flyout', () => {
		jest.useFakeTimers();
		const renderer = verify(
			<Flyout hover>
				<div />
			</Flyout>,
			{
				createNodeMock(ref) {
					const el = createNodeMock(ref);
					const { onMouseEnter, onMouseLeave } = ref.props;
					if (onMouseEnter) {
						el.addEventListener('mouseenter', onMouseEnter);
					}
					if (onMouseLeave) {
						el.addEventListener('mouseleave', onMouseLeave);
					}
					return el;
				},
			}
		);

		const inst = renderer.getInstance();
		jest.spyOn(inst, 'startShow');
		jest.spyOn(inst, 'startHide');
		jest.spyOn(inst, 'stopHide');

		expect(inst.hoverTimeouts).toMatchSnapshot();

		renderer.update(
			<Flyout hover={{ openTimeout: 1, closeTimeout: 2 }}>
				<div />
			</Flyout>
		);
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
		const renderer = verify(
			<Flyout hover>
				<div />
			</Flyout>,
			{
				createNodeMock(ref) {
					const el = createNodeMock(ref);
					const { onMouseEnter, onMouseLeave } = ref.props;
					if (onMouseEnter) {
						el.addEventListener('mouseenter', onMouseEnter);
					}
					if (onMouseLeave) {
						el.addEventListener('mouseleave', onMouseLeave);
					}
					document.body.append(el);
					return el;
				},
			}
		);

		const inst = renderer.getInstance();
		const flyout = renderer.root.findByType(Aligned);

		jest.spyOn(inst, 'startHide');
		jest.spyOn(inst, 'stopHide');

		inst.doOpen();
		jest.runAllTimers();

		flyout.props.onMouseEnter();
		expect(inst.stopHide).toHaveBeenCalled();

		flyout.props.onMouseLeave();
		expect(inst.startHide).toHaveBeenCalled();

		jest.runAllTimers();
	});

	test('Trigger Click Handlers', () => {
		const fn = jest.fn();
		const renderer = verify(
			<Flyout trigger={<div className="custom-trigger" onClick={fn} />}>
				<div>My Flyout Content</div>
			</Flyout>,
			{ createNodeMock }
		);

		const div = renderer.root.find(x =>
			/custom-trigger/.test(x.props.className)
		);
		div.props.onClick();

		expect(fn).toHaveBeenCalled();
	});

	test('Specify Trigger', () => {
		verify(<Flyout trigger="input" type="button" value="Test" />);
	});

	test('Specify Element Trigger', async () => {
		verify(<Flyout trigger={<a href="#test">Test</a>} value="Test" />);
	});

	test('[Non-forwarded-refs] Warns for Stateless component triggers', async () => {
		const MyTrigger = () => <a href="#test">Test</a>;

		jest.spyOn(console, 'warn').mockImplementation(() => {});
		jest.spyOn(console, 'error').mockImplementation(() => {});

		const renderer = verify(<Flyout trigger={MyTrigger} />, {
			createNodeMock,
		});

		expect(renderer.getInstance().trigger).toBeFalsy();

		expect(console.error).toHaveBeenCalledWith(
			expect.stringContaining('Function components cannot be given refs'),
			expect.anything(),
			expect.anything()
		);
		expect(console.warn).toHaveBeenCalledWith(
			expect.stringMatching(
				'A Stateless Component null ref was returned for the Trigger'
			),
			expect.anything(),
			expect.anything(),
			expect.anything()
		);

		console.error.mockClear();
		console.warn.mockClear();

		expect(renderer.getInstance().trigger).toBeFalsy();
		expect(console.error).not.toHaveBeenCalled();
		expect(console.warn).not.toHaveBeenCalled();
		console.error.mockClear();
		console.warn.mockClear();

		const renderer2 = verify(<Flyout trigger={<MyTrigger />} />, {
			createNodeMock,
		});

		expect(renderer2.getInstance().trigger).toBeFalsy();

		expect(console.error).toHaveBeenCalledWith(
			expect.stringContaining('Function components cannot be given refs'),
			expect.anything(),
			expect.anything()
		);
		expect(console.warn).toHaveBeenCalledWith(
			expect.stringMatching(
				'A Stateless Component null ref was returned for the Trigger'
			),
			expect.anything(),
			expect.anything(),
			expect.anything()
		);

		console.error.mockClear();
		console.warn.mockClear();

		expect(renderer2.getInstance().trigger).toBeFalsy();
		expect(console.error).not.toHaveBeenCalled();
		expect(console.warn).not.toHaveBeenCalled();
	});

	test('[Non-forwarded-refs] Warns for Component triggers that do not implement getDOMNode()', async () => {
		class MyTrigger extends React.Component {
			render() {
				return <a href="#test">Test</a>;
			}
		}
		jest.useFakeTimers();
		jest.spyOn(console, 'warn').mockImplementation(() => {});
		jest.spyOn(console, 'error').mockImplementation(() => {});

		const renderer = verify(<Flyout trigger={MyTrigger} />, {
			createNodeMock,
		});

		expect(renderer.getInstance().trigger).toBeFalsy();

		jest.runAllTimers();

		expect(console.error).not.toHaveBeenCalled();
		expect(console.warn).toHaveBeenCalledWith(
			expect.stringMatching(
				'A Component ref was returned for the Trigger'
			),
			expect.anything(),
			expect.anything(),
			expect.anything()
		);

		console.error.mockClear();
		console.warn.mockClear();

		expect(renderer.getInstance().trigger).toBeFalsy();
		expect(console.error).not.toHaveBeenCalled();
		expect(console.warn).not.toHaveBeenCalled();
		console.error.mockClear();
		console.warn.mockClear();

		const renderer2 = verify(<Flyout trigger={<MyTrigger />} />, {
			createNodeMock,
		});

		expect(renderer2.getInstance().trigger).toBeFalsy();
		jest.runAllTimers();
		expect(console.error).not.toHaveBeenCalled();
		expect(console.warn).toHaveBeenCalledWith(
			expect.stringMatching(
				'A Component ref was returned for the Trigger'
			),
			expect.anything(),
			expect.anything(),
			expect.anything()
		);

		console.error.mockClear();
		console.warn.mockClear();

		expect(renderer2.getInstance().trigger).toBeFalsy();
		expect(console.error).not.toHaveBeenCalled();
		expect(console.warn).not.toHaveBeenCalled();
	});

	test('[Non-forwarded-refs] Component trigger.getDOMNode() returns node', async () => {
		class MyTrigger extends React.Component {
			ref = React.createRef();
			getDOMNode = () => this.ref.current;
			render() {
				return (
					<a href="#test" ref={this.ref}>
						Test
					</a>
				);
			}
		}

		const renderer = verify(<Flyout trigger={MyTrigger} />, {
			createNodeMock,
		});

		expect(renderer.getInstance().trigger).toBeInstanceOf(Element);
	});

	test('Ref is not dropped from custom trigger', () => {
		jest.useFakeTimers();
		const ref = React.createRef();
		const renderer = verify(
			<Flyout
				trigger={
					<a href="#test" ref={ref}>
						Test
					</a>
				}
				value="Test"
			/>,
			{ createNodeMock }
		);

		jest.runAllTimers();
		expect(ref.current).toBeTruthy();
		// console.log(
		// 	'Hello There',
		// 	renderer.toJSON(),
		// 	renderer.getInstance().triggerRef,
		// 	ref
		// );
		expect(renderer.toJSON()).toMatchInlineSnapshot(`
		<a
		  aria-haspopup="dialog"
		  className="flyout-trigger flyout-closed"
		  href="#test"
		  onBlur={[Function]}
		  onClick={[Function]}
		  onFocus={[Function]}
		  onKeyPress={[Function]}
		  tabIndex={0}
		  value="Test"
		>
		  Test
		</a>
	`);
	});
});
