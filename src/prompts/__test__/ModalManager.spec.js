/* eslint-env jest */
import React from 'react';
import Modal from '../Modal';
import ModalManager from '../ModalManager';

jest.unmock('react-dom');

describe('ModalManager', () => {
	test ('Non-Portal modal', () => {
		jest.useFakeTimers();

		const reference = ModalManager.show(
			<div className="my-modal-content" />
		);

		expect(reference.component).toBeInstanceOf(Modal);
		expect(reference.isPortal).toBe(false);
		expect(reference.refocus).toBe(document.body);
		expect(reference.mountPoint).toBe(document.querySelector('body > .modal'));

		expect(document.querySelector('body > .modal div.my-modal-content')).not.toBe(null);

		reference.dismiss();

		jest.runAllTimers();

		expect(document.querySelector('body > .modal')).toBe(null);
	});
});
