/* eslint-env jest */
jest.mock('react-dom', () => require('../../__mocks__/react-dom.disabled'));
jest.mock('@nti/util-ios-version', () => () => global.simulateIOS);
jest.mock('@nti/lib-dom', () => Object.assign(
	require.requireActual('@nti/lib-dom'), {
		getScrollPosition: () => ({
			top: 100,
			left: 0,
		})
	}));

import React from 'react';

import {verify} from '../../__test__/utils';
import Modal from '../Modal';

const createNodeMock = ({type}) => document.createElement(type);


describe('Modals', () => {
	const mockManager = () => ({
		addUpdateListener: jest.fn(),
		removeUpdateListener: jest.fn(),
		isHidden: jest.fn(() => false)
	});

	afterEach(() => {
		delete global.simulateIOS;
	});

	test ('Simple Mount & Unmount', () => {
		const manager = mockManager();
		const dismiss = jest.fn();
		verify(<Modal Manager={manager} onDismiss={dismiss}/>, {createNodeMock}).unmount();

		expect(dismiss).not.toHaveBeenCalled();
		expect(manager.isHidden).toHaveBeenCalled();

		expect(manager.addUpdateListener).toHaveBeenCalled();

		const {mock: {calls: [args]}} = manager.addUpdateListener;

		expect(manager.removeUpdateListener).toHaveBeenCalledWith(...args);
	});

	test ('Close Event', () => {
		const manager = mockManager();
		const dismiss = jest.fn();
		const renderer = verify(<Modal Manager={manager} onDismiss={dismiss}/>, {createNodeMock});

		const cmp = renderer.getInstance();

		expect(() => cmp.close()).not.toThrow();
		expect(dismiss).toHaveBeenCalledWith(undefined);

		const event = {
			stopPropagation () {}
		};
		cmp.close(event);
		expect(dismiss).toHaveBeenCalledWith(event);

		renderer.unmount();
	});

	test ('Clicks inside modal do not trigger mask clicks', () => {
		const manager = mockManager();
		const dismiss = jest.fn();
		const renderer = verify(<Modal Manager={manager} onDismiss={dismiss}/>, {createNodeMock});

		const cmp = renderer.getInstance();

		const event = {
			stopPropagation: jest.fn()
		};

		jest.spyOn(cmp, 'onMaskClick');

		renderer.root.findByType('dialog').props.onClick(event);

		expect(cmp.onMaskClick).not.toHaveBeenCalled();
		expect(event.stopPropagation).toHaveBeenCalled();

		renderer.unmount();
	});

	test ('Mask clicks may close', () => {
		const manager = mockManager();
		const dismiss = jest.fn();
		const expression = <Modal Manager={manager} onDismiss={dismiss} />;
		const renderer = verify(expression, {createNodeMock});
		const cmp = renderer.getInstance();
		jest.spyOn(cmp, 'onMaskClick');

		//We need to re-render to get the spyed onMaskClick function
		renderer.update(React.cloneElement(expression));


		const event = {
			stopPropagation: jest.fn()
		};


		renderer.root.find(x => x.type === 'div' && x.props.onClick && /mask/.test(x.props.className)).props.onClick(event);

		expect(cmp.onMaskClick).toHaveBeenCalled();
		expect(event.stopPropagation).not.toHaveBeenCalled();

		renderer.update(React.cloneElement(expression, {closeOnMaskClick: true}));

		cmp.onMaskClick.mockClear();
		event.stopPropagation.mockClear();

		renderer.root.find(x => x.type === 'div' && x.props.onClick && /mask/.test(x.props.className)).props.onClick(event);

		expect(cmp.onMaskClick).toHaveBeenCalled();
		expect(event.stopPropagation).toHaveBeenCalled();

		renderer.unmount();
	});

	test ('Safari Hack', () => {
		const manager = mockManager();
		const dismiss = jest.fn();
		const renderer = verify(<Modal Manager={manager} onDismiss={dismiss}/>, {createNodeMock});

		const cmp = renderer.getInstance();

		cmp.onFocus({target: {tagName: 'input'}});
		expect(cmp.state.safariFix).toBeUndefined();
		cmp.onBlur({target: {tagName: 'input'}});
		expect(cmp.state.safariFix).toBeUndefined();

		global.simulateIOS = true;
		cmp.onFocus({target: {tagName: 'input'}});
		expect(cmp.state.safariFix).toBe(true);
		cmp.onBlur({target: {tagName: 'input'}});
		expect(cmp.state.safariFix).toBe(false);

		renderer.unmount();
	});

});
