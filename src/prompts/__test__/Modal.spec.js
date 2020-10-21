/* eslint-env jest */
jest.mock('react-dom', () => require('../../__mocks__/react-dom.disabled'));
jest.mock('@nti/util-ios-version', () => () => global.simulateIOS);
jest.mock('@nti/lib-dom', () => ({ ...jest.requireActual('@nti/lib-dom'),
	getScrollPosition: () => ({
		top: 100,
		left: 0,
	})
}));

import React from 'react';

import {verify} from '../../__test__/utils';
import Modal from '../Modal';

// const createNodeMock = ({type}) => document.createElement(type);


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
		verify(<Modal Manager={manager} onDismiss={dismiss}/>).unmount();

		expect(dismiss).not.toHaveBeenCalled();
		expect(manager.isHidden).toHaveBeenCalled();

		expect(manager.addUpdateListener).toHaveBeenCalled();

		const {mock: {calls: [args]}} = manager.addUpdateListener;

		expect(manager.removeUpdateListener).toHaveBeenCalledWith(...args);
	});

	test ('Close Event', () => {
		const manager = mockManager();
		const dismiss = jest.fn();
		const renderer = verify(<Modal Manager={manager} onDismiss={dismiss}/>);

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


	test ('Safari Hack', () => {
		const manager = mockManager();
		const dismiss = jest.fn();
		const renderer = verify(<Modal Manager={manager} onDismiss={dismiss}/>);

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
