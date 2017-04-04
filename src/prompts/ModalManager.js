import EventEmitter from 'events';

import React from 'react';
import ReactDOM from 'react-dom';
import {createDOM} from 'nti-lib-dom';
import {buffer} from 'nti-commons';

import Modal from './components/Modal';


const setHidden = (node, hidden) => node.setAttribute('aria-hidden', hidden);
const focusElement = (node) => node && node.focus();

const EVENT = 'updated';

/**
 * @typedef ModalReference
 * @param {Function} dismiss close the Dialog
 * @param {Node} mountPoint DOM element the dialog is mounted at
 * @param {Node} refocus DOM element to refocus when closed
 */



export class ModalManager extends EventEmitter {

	active = []

	get lastIndex () {
		return this.active.length - 1;
	}

	getTopMost () {
		const {lastIndex} = this;
		return this.active[lastIndex];
	}


	hide (node) {
		ReactDOM.unmountComponentAtNode(node);
		if (node.parentNode) {
			document.body.removeChild(node);
		}

		const ref = this.active.find(x => x.mountPoint === node);
		if (ref) {
			this.remove(ref);
		}
	}

	/**
	 * Display a modal
	 *
	 * @param  {React.Element} content The JSX expression to render into a dialog
	 * @param  {String|Object} options Options or className
	 * @param {String} options.className Additional classname to add to the dialog
	 * @param {Boolean} options.closeOnMaskClick Enables dismissing the dialog when the mask is clicked.
	 * @param {Function} options.onBeforeDismiss ----
	 * @param {Boolean} options.tall Indicates that the content will be tall; triggers css changes
	 * @param {Node} options.mountPoint the DOM node that the dialog should mount/re-render to.
	 * @param {Node} options.refocus the DOM node to refocus when the dialog closes.
	 * @return {ModalReference} Stuff & Things
	 */
	show (content, options = {}) {
		//Back-compat... if the second arg is a string, wrap it into an "options" object...otherwise, passthrough.
		options = (typeof options === 'string') ? {className: options} : options;

		const {className, closeOnMaskClick, onBeforeDismiss, tall, mountPoint, refocus = document.activeElement} = options;

		const container = this.getContainer(mountPoint);

		const dismiss = buffer(1, () =>
				(!onBeforeDismiss || onBeforeDismiss() !== false) && this.hide(container));

		const reference = {
			dismiss,
			mountPoint: container,
			refocus
		};

		const setReference = x => reference.component = x;

		ReactDOM.render((
				<Modal
					ref={setReference}
					onDismiss={dismiss}
					className={className}
					tall={tall}
					closeOnMaskClick={closeOnMaskClick}
					children={content}
					/>
			),
			container
		);

		this.add(reference);

		return reference;

	}


	getContainer (existing) {
		const container = existing || createDOM({class: 'modal'});
		const {body} = document;
		if (body.lastChild !== container) {
			body.appendChild(container);
		}
		return container;
	}


	isHidden (component) {
		const {content} = component || {};

		if (!content) {
			return true;
		}

		//reversed for lookup speed
		const reversed = this.active.slice().reverse();
		const lastIndex = 0;
		const index = reversed.findIndex(x => (x.component === component) || x.mountPoint.contains(component.content));
		return index !== lastIndex;
	}


	add (reference) {
		const {active} = this;
		const index = active.findIndex(x => x.mountPoint === reference.mountPoint);

		//add
		if (index < 0) {
			this.active = [...active, reference];
		}
		//update
		else {
			const A = active.slice(0, index);
			const B = active.slice(index + 1);
			this.active = [
				...A,
				reference,
				...B
			];
		}

		this.update();
	}


	remove ({mountPoint, refocus}) {
		const {lastIndex, active} = this;

		const index = active.findIndex(x => x.mountPoint === mountPoint);
		const removingTopModal = lastIndex === index;
		const ref = active[index];

		if (index >= 0) {
			const A = active.slice(0, index);
			const B = active.slice(index + 1);
			this.active = [
				...A,
				...B
			];
		}

		this.update(); //updating has to come before refocusing.

		//Only refocus if the top modal was removed.
		if (removingTopModal) {
			focusElement(refocus || (ref && ref.refocus));
		}
	}


	update () {
		this.updateARIA();

		if (this.active.length) {
			this.addDocumentListeners();
		} else {
			this.removeDocumentListeners();
		}

		this.emit(EVENT);
	}


	updateARIA () {
		const {active, lastIndex} = this;
		const mainContent = document.getElementById('content');

		if (mainContent) {
			setHidden(mainContent, lastIndex >= 0);
		}

		active.forEach((ref, i) => {

			setHidden(ref.mountPoint, i !== lastIndex);

		});
	}


	addUpdateListener (fn) {
		this.addListener(EVENT, fn);
	}


	removeUpdateListener (fn) {
		this.removeListener(EVENT, fn);
	}


	addDocumentListeners () {
		if (!this.installedDocumentListeners) {
			this.installedDocumentListeners = true;
			document.addEventListener('focus', this.onDocumentFocus, true);
			document.addEventListener('keydown', this.onDocumentKeyDown, true);
		}
	}


	removeDocumentListeners () {
		document.removeEventListener('focus', this.onDocumentFocus, true);
		document.removeEventListener('keydown', this.onDocumentKeyDown, true);
		delete this.installedDocumentListeners;
	}


	onDocumentFocus = (e) => {
		const top = this.getTopMost();
		if (!top) {
			return;
		}

		const mask = Node.DOCUMENT_POSITION_FOLLOWING;

		const isAfter = (a) => (top.mountPoint.compareDocumentPosition(a) & mask) === mask; //eslint-disable-line

		if (!top.mountPoint.contains(e.target) && !isAfter(e.target) && document.contains(e.target)) {
			e.stopPropagation();
			try {
				// top.mountPoint.querySelector('dialog').focus();
				top.component.focus();
			} catch (er) {
				console.error(er.stack || er.message || er); //eslint-disable-line no-console
			}
		}
	}


	onDocumentKeyDown = (e) => {
		const top = this.getTopMost();
		if (top && e.keyCode === 27) {
			top.dismiss();
		}
	}
}

export default new ModalManager();
