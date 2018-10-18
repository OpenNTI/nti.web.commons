/* eslint-env jest */
jest.mock('react-dom', () => require('../../__mocks__/react-dom.disabled'));
jest.mock('@nti/lib-dom', () => Object.assign(
	require.requireActual('@nti/lib-dom'), {
		getScrollPosition: () => ({
			top: 100,
			left: 0,
		})
	}));

import React from 'react';

import {verify} from '../../__test__/utils';
import Dialog from '../Dialog';
import Manager from '../ModalManager';

const createNodeMock = ({type}) => document.createElement(type);

function getEscapeEvent () {
	const event = new CustomEvent('keydown');
	event.keyCode = 27;
	return event;
}

function mockScrollElement () {
	Object.defineProperty(document, 'scrollingElement', {
		configurable: true,
		value: {
			scrollTo: jest.fn()
		}
	});
}

describe('Dialogs', () => {
	document.body.innerHTML = '<div id="content"></div>';
	const content = document.body.firstChild;
	Object.defineProperty(document, 'activeElement', {configurable: true, value: content});

	beforeEach(() => {
		Manager.active.splice(0); // prevent each test from corrupting the next.
	});

	afterEach(() => {
		delete document.activeElement;
		delete document.scrollingElement;
	});

	test ('Simple Mount & Unmount', () => {
		jest.useFakeTimers();
		const Hi = () => <div>Hi</div>;
		const cmp = verify(<Dialog><Hi/></Dialog>, {createNodeMock});

		//Update lifecycle
		cmp.update(<Dialog><div>Hi2</div></Dialog>);


		expect(Manager.active.length).toBe(1);
		cmp.unmount();

		jest.runAllTimers();

		expect(Manager.active.length).toBe(0);
		expect(cmp.getInstance()).toBe(null);
	});

	test ('RestoreScroll on Unmount', () => {
		mockScrollElement();
		jest.useFakeTimers();

		Object.defineProperty(document, 'activeElement', {
			configurable: true,
			value: null
		});

		const cmp = verify(<Dialog restoreScroll alignTop><div>Hi</div></Dialog>, {createNodeMock});
		jest.runAllTimers();

		cmp.unmount();

		jest.runAllTimers();

		expect(document.scrollingElement.scrollTo).toHaveBeenCalledWith(0, 100);
	});

	test ('RestoreScroll custom fn on Unmount', () => {
		mockScrollElement();
		jest.useFakeTimers();

		const fn = jest.fn(() => true);
		const cmp = verify(<Dialog restoreScroll={fn} alignTop><div>Hi</div></Dialog>, {createNodeMock});

		jest.runAllTimers();

		cmp.unmount();

		jest.runAllTimers();

		expect(fn).toHaveBeenCalled();
		expect(document.scrollingElement.scrollTo).toHaveBeenCalledWith(0, 100);
	});


	test ('Escape Key Behavior', () => {
		jest.useFakeTimers();
		const fnA = jest.fn();
		const fnB = jest.fn();
		const btm = verify(<Dialog onBeforeDismiss={() => (fnA(), btm.unmount())}><div>Hi</div></Dialog>, {createNodeMock});
		const top = verify(<Dialog closeOnEscape={false} onBeforeDismiss={() => (fnB(), top.unmount())}><div>Yo</div></Dialog>, {createNodeMock});

		expect(Manager.active.length).toBe(2);

		document.dispatchEvent(getEscapeEvent());
		jest.runAllTimers();

		expect(fnA).not.toHaveBeenCalled();
		expect(fnB).not.toHaveBeenCalled();
		expect(Manager.active.length).toBe(2);

		top.unmount();
		jest.runAllTimers();

		expect(fnA).not.toHaveBeenCalled();
		expect(fnB).not.toHaveBeenCalled();
		expect(Manager.active.length).toBe(1);

		document.dispatchEvent(getEscapeEvent());
		jest.runAllTimers();

		expect(fnA).toHaveBeenCalled();
		expect(Manager.active.length).toBe(0);
	});


	test ('Focus Behavior', () => {
		jest.useFakeTimers();
		Manager.onDocumentFocus();

		const focus = jest.fn();
		const NodeMockFactory = (i) => {
			const ref = document.createElement(i.type);
			Object.defineProperty(ref, 'focus', {value: focus});
			return ref;
		};

		const btm = verify(<Dialog><div>Hi</div></Dialog>, {createNodeMock: NodeMockFactory});
		const top = verify(<Dialog><div>Yo</div></Dialog>, {createNodeMock: NodeMockFactory});

		const [{mountPoint: div}] = Manager.active;

		Manager.onDocumentFocus({target: div, stopPropagation () {}});

		jest.runAllTimers();

		expect(focus).toHaveBeenCalled();

		top.unmount();
		btm.unmount();
	});


	test ('Rollbock History', () => {
		jest.useFakeTimers();

		const fn = jest.fn(x => {
			// excercise callback ... should not throw,
			jest.spyOn(global.history, 'go');
			x.rollback();

			// simulate no rollback required (empty state)
			Object.defineProperty(global.history, 'state', {value: null});
			//should no-op and not throw
			x.rollback();
		});

		const cmp = verify(<Dialog onBeforeDismiss={fn}><div>Yo</div></Dialog>, {createNodeMock});

		document.dispatchEvent(getEscapeEvent());
		jest.runAllTimers();

		expect(global.history.go).toHaveBeenCalled();
		expect(fn).toHaveBeenCalled();

		cmp.unmount();
	});

});
