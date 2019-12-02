import EventEmitter from 'events';

import React from 'react';
import ReactDOM from 'react-dom';
import {createDOM, getScrollPosition, getScrollParent, scrollElementTo} from '@nti/lib-dom';
import {buffer} from '@nti/lib-commons';

import Modal from './Modal';


const setHidden = (node, hidden) => node.setAttribute('aria-hidden', hidden);
const focusElement = (node) => node && node.focus();
const setScroll = ({maybeRestoreScroll, scroller, left, top} = {}) => ((top + left) > 0)
	&& maybeRestoreScroll()
	&& (setTimeout(() => scrollElementTo(scroller, left, top), 1));
const YesFn = () => true;

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
		const ref = this.active.find(x => x.mountPoint === node);
		if (ref && !ref.isPortal) {
			ReactDOM.unmountComponentAtNode(node);
		}
		/* istanbul ignore else */
		if (node.parentNode) {
			document.body.removeChild(node);
		}
		/* istanbul ignore else */
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
	 * @param {Boolean} options.tall Don't center the dialog. Position it at the top instead.
	 * @param {Node} options.mountPoint the DOM node that the dialog should mount/re-render to.
	 * @param {Node} options.refocus the DOM node to refocus when the dialog closes.
	 * @param {Boolean|Function} options.restoreScroll restore scroll position on dismissal
	 * @param {Boolean} options.forceFront push the mount point to the front of the stack on re-renders
	 * @param {Boolean} options.usePortal opt into using a portal
	 * @return {ModalReference} Stuff & Things
	 * @public
	 */
	show (content, options = {}) {
		//Back-compat... if the second arg is a string, wrap it into an "options" object...otherwise, passthrough.
		options = (typeof options === 'string')
			/* istanbul ignore next */
			? {className: options}
			: options;

		const {
			className,
			closeOnMaskClick,
			closeOnEscape,
			onBeforeDismiss,
			tall,
			mountPoint,
			refocus = document.activeElement,
			restoreScroll,
			forceFront,
			usePortal,
		} = options;

		const container = this.getContainer(mountPoint, forceFront);

		const dismiss = buffer(1, () =>
			(!onBeforeDismiss || onBeforeDismiss() !== false) && this.hide(container));

		// scrollingElement is what we want ALL the time. (modals are appended to <body>),
		// but in old browsers we need to fallback to getScrollParent(container)
		// mountPoint is not intended to be provided by the first invocation, but subsequent
		// calls (to re-render and update) will have the "reference" object passed as "options".
		const scroller = document.scrollingElement || getScrollParent(container);

		const isPortal = Boolean(ReactDOM.createPortal && usePortal);
		const reference = {
			isPortal,
			dismiss,
			mountPoint: container,
			refocus,
			closeOnEscape,
			scroll: !restoreScroll ? void 0 : {
				maybeRestoreScroll: typeof restoreScroll === 'function' ? restoreScroll : YesFn,
				scroller,
				...getScrollPosition(scroller)
			}
		};

		const setReference = x => reference.component = x;
		const render = isPortal ?
			(...args) => ReactDOM.createPortal(...args) :
			(...args) => void ReactDOM.render(...args);

		reference.portalRef = render((
			<Modal
				Manager={this}
				ref={setReference}
				onDismiss={dismiss}
				className={className}
				tall={tall}
				closeOnMaskClick={closeOnMaskClick}
				isPortal={isPortal}
				children={content}
			/>
		),
		container
		);

		this.add(reference);

		return reference;

	}


	getContainer (existing, forceFront) {
		const container = existing || createDOM({class: 'modal'});
		/* istanbul ignore else */
		if (forceFront || !existing) {
			const {body} = document;
			/* istanbul ignore else */
			if (body.lastChild !== container) {
				body.appendChild(container);
			}
		}
		return container;
	}


	isHidden (component) {
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


	remove ({mountPoint, refocus, scroll}) {
		const {lastIndex, active} = this;

		const index = active.findIndex(x => x.mountPoint === mountPoint);
		const removingTopModal = lastIndex === index;
		const ref = active[index];

		/* istanbul ignore else */
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
		/* istanbul ignore else */
		if (removingTopModal) {
			focusElement(refocus || (ref && ref.refocus));
			setScroll(scroll || (ref && ref.scroll));
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

		/* istanbul ignore else */
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
		/* istanbul ignore if */
		if (!top) {
			return;
		}

		const mask = Node.DOCUMENT_POSITION_FOLLOWING;

		const isAfter = (a) => (top.mountPoint.compareDocumentPosition(a) & mask) === mask; //eslint-disable-line

		/* istanbul ignore else */
		if (!top.mountPoint.contains(e.target) && !isAfter(e.target) && document.contains(e.target) && !this.allowedExternalFocus(e.target)) {
			e.stopPropagation();
			try {
				top.component.focus();
			} catch (er) {
				/* istanbul ignore next */
				console.error('Could not focus top most component: %o', top); //eslint-disable-line no-console
			}
		}
	}


	onDocumentKeyDown = (e) => {
		const top = this.getTopMost();
		/* istanbul ignore else */
		if (top && top.closeOnEscape && !this.ignoreEscape && e.keyCode === 27) {
			top.dismiss();
		}
	}

	setAllowedExternalFocus (fn) {
		this.allowedExternalFocusInFn = fn;
	}

	allowedExternalFocus (target) {
		return this.allowedExternalFocusInFn && this.allowedExternalFocusInFn(target);
	}


	suspendEscapeListener = () => {
		this.ignoreEscape = true;
	}


	resumeEscapeListener = () => {
		this.ignoreEscape = false;
	}
}

export default new ModalManager();
