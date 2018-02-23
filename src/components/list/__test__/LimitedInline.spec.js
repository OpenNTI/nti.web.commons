/* eslint-env jest */
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
				React.createElement(Inline, {}, ...children),
				div,
				done
			);
		});

		test('Has One Item', () => {
			const items = getItemsFromDOM();

			expect(items.length).toEqual(1);
		});

		test('Preserves Item Order', () => {
			const items = getItemsFromDOM();

			for (let i = 0; i < items.length; i++) {
				expect(items[i].textContent).toEqual(children[i]);
			}
		});

		test('Has No Separators', () => {
			const separators = getSeparatorsFromDOM();

			expect(separators.length).toEqual(0);
		});

		test('Has No Remaining', () => {
			const remaining = getRemainingFromDOM();

			expect(remaining.length).toEqual(0);
		});

		test('Has Expected Text', () => {
			const list = getListDOM();
			const text = list.textContent;

			expect(text).toEqual('Item 1');
		});
	});


	describe('Two Items', () => {
		const children = ['Item 1', 'Item 2'];

		beforeEach(done => {
			ReactDOM.render(
				React.createElement(Inline, {limit: 5}, ...children),
				div,
				done
			);
		});

		test('Has One Item', () => {
			const items = getItemsFromDOM();

			expect(items.length).toEqual(2);
		});

		test('Preserves Item Order', () => {
			const items = getItemsFromDOM();

			for (let i = 0; i < items.length; i++) {
				expect(items[i].textContent).toEqual(children[i]);
			}
		});

		test('Has No Separators', () => {
			const separators = getSeparatorsFromDOM();

			expect(separators.length).toEqual(0);
		});

		test('Has One Remaining', () => {
			const remaining = getRemainingFromDOM();

			expect(remaining.length).toEqual(1);
		});

		test('Has Expected Text', () => {
			const list = getListDOM();
			const text = list.textContent;

			expect(text).toEqual('Item 1 and Item 2');
		});
	});


	describe('Less Than Max', () => {
		const children = ['Item 1', 'Item 2', 'Item 3'];

		beforeEach(done => {
			ReactDOM.render(
				React.createElement(Inline, {limit: 5}, ...children),
				div,
				done
			);
		});

		test('Has All Items', () => {
			const items = getItemsFromDOM();

			expect(items.length).toEqual(children.length);
		});

		test('Preserves Item Order', () => {
			const items = getItemsFromDOM();

			for (let i = 0; i < items.length; i++) {
				expect(items[i].textContent).toEqual(children[i]);
			}
		});

		test('Has Separators', () => {
			const separators = getSeparatorsFromDOM();

			expect(separators.length).toEqual(1);
		});

		test('Has One Remaining', () => {
			const remaining = getRemainingFromDOM();

			expect(remaining.length).toEqual(1);
		});

		test('Has Expected Text', () => {
			const list = getListDOM();
			const text = list.textContent;

			expect(text).toEqual('Item 1, Item 2, and Item 3');
		});
	});


	describe('More Than Max', () => {
		const children = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

		beforeEach(done => {
			ReactDOM.render(
				React.createElement(Inline, {limit: 2}, ...children),
				div,
				done
			);
		});

		test('Has Max Items', () => {
			const items = getItemsFromDOM();

			expect(items.length).toEqual(2);
		});

		test('Preserves Item Order', () => {
			const items = getItemsFromDOM();

			for (let i = 0; i < items.length; i++) {
				expect(items[i].textContent).toEqual(children[i]);
			}
		});

		test('Has Remaining', () => {
			const remaining = getRemainingFromDOM();

			expect(remaining.length).toEqual(1);
			expect(remaining[0].textContent).toEqual('2 Others');
		});

		test('Has Expected Text', () => {
			const list = getListDOM();
			const text = list.textContent;

			expect(text).toEqual('Item 1, Item 2, and 2 Others');
		});
	});
});
