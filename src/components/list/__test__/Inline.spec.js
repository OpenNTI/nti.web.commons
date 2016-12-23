import React from 'react';
import ReactDOM from 'react-dom';

import Inline from '../Inline';


describe('Inline List Tests', () => {
	let div;

	function getListDOM () {
		return div.querySelector('.inline-list');
	}

	function getItemsFromDOM () {
		return div.querySelectorAll('.inline-list > .item');
	}

	function getSeparatorsFromDOM () {
		return div.querySelectorAll('.inline-list > .separator');
	}

	function getRemainingFromDOM () {
		return div.querySelectorAll('.inline-list > .remaining');
	}

	beforeEach(() => {
		div = document.createElement('div');

		document.body.appendChild(div);
	});


	afterEach(() => {
		document.body.removeChild(div);
	});

	describe('One Item', () => {
		const children = ['Item 1'];

		beforeEach(done => {
			ReactDOM.render(
				React.createElement(Inline, {children}),
				div,
				done
			);
		});

		it('Has One Item', () => {
			const items = getItemsFromDOM();

			expect(items.length).toEqual(1);
		});

		it('Preserves Item Order', () => {
			const items = getItemsFromDOM();

			for (let i = 0; i < items.length; i++) {
				expect(items[i].innerText).toEqual(children[i]);
			}
		});

		it('Has No Separators', () => {
			const separators = getSeparatorsFromDOM();

			expect(separators.length).toEqual(0);
		});

		it('Has No Remaining', () => {
			const remaining = getRemainingFromDOM();

			expect(remaining.length).toEqual(0);
		});

		it('Has Expected Text', () => {
			const list = getListDOM();
			const text = list.innerText;

			expect(text).toEqual('Item 1');
		});
	});


	describe('Two Items', () => {
		const children = ['Item 1', 'Item 2'];

		beforeEach(done => {
			ReactDOM.render(
				React.createElement(Inline, {children, limit: 5}),
				div,
				done
			);
		});

		it ('Has One Item', () => {
			const items = getItemsFromDOM();

			expect(items.length).toEqual(2);
		});

		it('Preserves Item Order', () => {
			const items = getItemsFromDOM();

			for (let i = 0; i < items.length; i++) {
				expect(items[i].innerText).toEqual(children[i]);
			}
		});

		it('Has No Separators', () => {
			const separators = getSeparatorsFromDOM();

			expect(separators.length).toEqual(0);
		});

		it('Has One Remaining', () => {
			const remaining = getRemainingFromDOM();

			expect(remaining.length).toEqual(1);
		});

		it('Has Expected Text', () => {
			const list = getListDOM();
			const text = list.innerText;

			expect(text).toEqual('Item 1 and Item 2');
		});
	});


	describe('Less Than Max', () => {
		const children = ['Item 1', 'Item 2', 'Item 3'];

		beforeEach(done => {
			ReactDOM.render(
				React.createElement(Inline, {children, limit: 5}),
				div,
				done
			);
		});

		it('Has All Items', () => {
			const items = getItemsFromDOM();

			expect(items.length).toEqual(children.length);
		});

		it('Preserves Item Order', () => {
			const items = getItemsFromDOM();

			for (let i = 0; i < items.length; i++) {
				expect(items[i].innerText).toEqual(children[i]);
			}
		});

		it('Has Separators', () => {
			const separators = getSeparatorsFromDOM();

			expect(separators.length).toEqual(1);
		});

		it('Has One Remaining', () => {
			const remaining = getRemainingFromDOM();

			expect(remaining.length).toEqual(1);
		});

		it('Has Expected Text', () => {
			const list = getListDOM();
			const text = list.innerText;

			expect(text).toEqual('Item 1, Item 2, and Item 3');
		});
	});


	describe('More Than Max', () => {
		const children = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

		beforeEach(done => {
			ReactDOM.render(
				React.createElement(Inline, {children, limit: 2}),
				div,
				done
			);
		});

		it('Has Max Items', () => {
			const items = getItemsFromDOM();

			expect(items.length).toEqual(2);
		});

		it('Preserves Item Order', () => {
			const items = getItemsFromDOM();

			for (let i = 0; i < items.length; i++) {
				expect(items[i].innerText).toEqual(children[i]);
			}
		});

		it('Has Remaining', () => {
			const remaining = getRemainingFromDOM();

			expect(remaining.length).toEqual(1);
			expect(remaining[0].innerText).toEqual('2 Others');
		});

		it('Has Expected Text', () => {
			const list = getListDOM();
			const text = list.innerText;

			expect(text).toEqual('Item 1, Item 2, and 2 Others');
		});
	});
});
