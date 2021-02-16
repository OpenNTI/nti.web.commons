/* eslint-env jest */
import { Tokens } from '../../utils';
import { buildMockToken as baseMockToken } from '../../utils/__test__/tokens.spec';
import {
	addTokens,
	needsTruncating,
	cleanupTokens,
	addEllipse,
	removeTokens,
} from '../overflow-utils';

const FONT_WIDTH = 10;
const FONT_HEIGHT = 10;

function buildMockToken(prevToken, containerWidth, word) {
	const token = baseMockToken(word);

	token.getBoundingClientRect = () => {
		const inner = token.innerHTML;
		const width = inner.length * FONT_WIDTH;

		const prevRect = prevToken
			? prevToken.getBoundingClientRect()
			: { top: 0, right: 0 };
		let top = prevRect.top;
		let left = prevRect.right;

		//if it won't fit, wrap to the next line
		if (left + width > containerWidth) {
			top = prevRect.bottom;
			left = 0;
		}

		return {
			top,
			left,
			bottom: top + FONT_HEIGHT,
			right: left + width,
			width,
			height: FONT_HEIGHT,
		};
	};

	token.getClientRects = () => [token.getBoundingClientRect()];

	return token;
}

function buildMockScratchPad(words, width) {
	const pad = document.createElement('div');

	let prevToken = null;

	for (let word of words) {
		const token = buildMockToken(prevToken, width, word);

		prevToken = token;
		pad.appendChild(token);
	}

	return pad;
}

describe('overflow-utils tests', () => {
	describe('addTokens', () => {
		test('splits each word into tokens', () => {
			const text = 'this is a test';
			const pad = document.createElement('div');

			addTokens(pad, text);

			const tokens = Tokens.getTokensFromNode(pad);

			expect(tokens.length).toEqual(4);
			expect(tokens[0].textContent).toEqual('this');
			expect(tokens[1].textContent).toEqual('is');
			expect(tokens[2].textContent).toEqual('a');
			expect(tokens[3].textContent).toEqual('test');
		});

		test('preserves other markup', () => {
			const text = 'this <b>is</b> a <a>test</a>';

			const pad = document.createElement('div');

			addTokens(pad, text);

			const tokens = Tokens.getTokensFromNode(pad);
			const bold = pad.querySelector('b');
			const anchor = pad.querySelector('a');

			expect(bold.textContent).toEqual('is');
			expect(anchor.textContent).toEqual('test');

			expect(tokens.length).toEqual(4);
			expect(tokens[0].textContent).toEqual('this');
			expect(tokens[1].textContent).toEqual('is');
			expect(tokens[2].textContent).toEqual('a');
			expect(tokens[3].textContent).toEqual('test');
		});
	});

	describe('needsTruncating', () => {
		test('false is scroll size is node size', () => {
			const node = {
				clientHeight: 100,
				clientWidth: 100,
				scrollHeight: 100,
				scrollWidth: 100,
			};

			expect(needsTruncating(node, 0)).toBeFalsy();
		});

		test('true if vertical scroll is larger than the buffer', () => {
			const node = {
				clientHeight: 100,
				clientWidth: 100,
				scrollHeight: 110,
				scrollWidth: 100,
			};

			expect(needsTruncating(node, 5)).toBeTruthy();
		});

		test('true if there is any horizontal scroll', () => {
			const node = {
				clientHeight: 100,
				clientWidth: 100,
				scrollHeight: 100,
				scrollWidth: 101,
			};

			expect(needsTruncating(node, 5)).toBeTruthy();
		});
	});

	describe('cleanupTokens', () => {
		test('one word, shorter than the width leaves the word', () => {
			const width = 31;
			const height = 10;

			const pad = buildMockScratchPad(['aaa'], width);

			cleanupTokens(pad, height, width);

			const tokens = Tokens.getTokensFromNode(pad);

			expect(tokens.length).toBe(1);
			expect(tokens[0].innerHTML).toBe('aaa');
		});

		test('one word, longer than the width leave the word', () => {
			const width = 29;
			const height = 10;

			const pad = buildMockScratchPad(['aaa'], width);

			cleanupTokens(pad, height, width);

			const tokens = Tokens.getTokensFromNode(pad);

			expect(tokens.length).toBe(1);
			expect(tokens[0].innerHTML).toBe('aaa');
		});

		test('two words, first word is too wide leaves only the first word', () => {
			const width = 29;
			const height = 21;

			const pad = buildMockScratchPad(['aaaa', 'bbb'], width);

			cleanupTokens(pad, height, width);

			const tokens = Tokens.getTokensFromNode(pad);

			expect(tokens.length).toBe(1);
			expect(tokens[0].innerHTML).toBe('aaaa');
		});

		test('two words, second word is overflowing leaves both words', () => {
			const width = 31;
			const height = 19;

			const pad = buildMockScratchPad(['aaa', 'bbb'], width);

			cleanupTokens(pad, height, width);

			const tokens = Tokens.getTokensFromNode(pad);

			expect(tokens.length).toBe(2);
			expect(tokens[0].innerHTML).toBe('aaa');
			expect(tokens[1].innerHTML).toBe('bbb');
		});

		test('two words, neither overflowing leaves both words', () => {
			const width = 31;
			const height = 21;

			const pad = buildMockScratchPad(['aaa', 'bbb'], width);

			cleanupTokens(pad, height, width);

			const tokens = Tokens.getTokensFromNode(pad);

			expect(tokens.length).toBe(2);
			expect(tokens[0].innerHTML).toBe('aaa');
			expect(tokens[1].innerHTML).toBe('bbb');
		});

		test('three words, first word is too wide leave only the first word', () => {
			const width = 30;
			const height = 30;

			const pad = buildMockScratchPad(['aaaa', 'bbb', 'ccc'], width);

			cleanupTokens(pad, height, width);

			const tokens = Tokens.getTokensFromNode(pad);

			expect(tokens.length).toBe(1);
			expect(tokens[0].innerHTML).toBe('aaaa');
		});

		test('three words, second word is overflowing leaves the first two words', () => {
			const width = 31;
			const height = 19;

			const pad = buildMockScratchPad(['aaa', 'bbb', 'ccc'], width);

			cleanupTokens(pad, height, width);

			const tokens = Tokens.getTokensFromNode(pad);

			expect(tokens.length).toBe(2);
			expect(tokens[0].innerHTML).toBe('aaa');
			expect(tokens[1].innerHTML).toBe('bbb');
		});

		test('three words, third overflowing leaves all words', () => {
			const width = 31;
			const height = 29;

			const pad = buildMockScratchPad(['aaa', 'bbb', 'ccc'], width);

			cleanupTokens(pad, height, width);

			const tokens = Tokens.getTokensFromNode(pad);

			expect(tokens.length).toBe(3);
			expect(tokens[0].innerHTML).toBe('aaa');
			expect(tokens[1].innerHTML).toBe('bbb');
			expect(tokens[2].innerHTML).toBe('ccc');
		});
	});

	describe('addEllipse', () => {
		const ellipse = '...';

		test('one line, one word that is too wide', () => {
			const width = 40;
			const height = 11;

			const pad = buildMockScratchPad(['aaaaaa'], width);

			addEllipse(ellipse, pad, height, width);

			const tokens = Tokens.getTokensFromNode(pad);

			expect(tokens.length).toBe(1);
			expect(tokens[0].innerHTML).toBe('a...');
		});

		test('one line, one word that fits', () => {
			const width = 50;
			const height = 11;

			const pad = buildMockScratchPad(['aaaa'], width);

			addEllipse(ellipse, pad, height, width);

			const tokens = Tokens.getTokensFromNode(pad);

			expect(tokens.length).toBe(1);
			expect(tokens[0].innerHTML).toBe('aa...');
		});

		test('one line, two words only room for one', () => {
			const width = 40;
			const height = 11;

			const pad = buildMockScratchPad(['aaaa', 'bbbb'], width);

			addEllipse(ellipse, pad, height, width);

			const tokens = Tokens.getTokensFromNode(pad);

			expect(tokens.length).toBe(1);
			expect(tokens[0].innerHTML).toBe('a...');
		});

		test('one line, two words room for both', () => {
			const width = 90;
			const height = 11;

			const pad = buildMockScratchPad(['aaaaa', 'bbbbb'], width);

			addEllipse(ellipse, pad, height, width);

			const tokens = Tokens.getTokensFromNode(pad);

			expect(tokens.length).toBe(2);
			expect(tokens[0].innerHTML).toBe('aaaaa');
			expect(tokens[1].innerHTML).toBe('b...');
		});
	});

	describe('removeTokens', () => {
		test('turns tokens back to text nodes', () => {
			const text = 'this is a test';

			const pad = document.createElement('div');

			addTokens(pad, text);

			expect(pad.innerHTML).not.toBe(text);

			removeTokens(pad);

			expect(pad.innerHTML).toBe(text);
		});

		test('preserves other markup', () => {
			const text = '<b>this</b> <i>is</i> a <a>test</a>';

			const pad = document.createElement('div');

			addTokens(pad, text);

			expect(pad.innerHTML).not.toBe(text);

			removeTokens(pad);

			expect(pad.innerHTML).toBe(text);
		});
	});
});
