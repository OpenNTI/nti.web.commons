/* eslint-env jest */
import {getRenderer} from '../';
import Complex from '../Complex';
import Markup from '../Markup';
import PlainText from '../PlainText';


const COMPLEX_PROPS = {text: 'text', hasMarkup: false, hasComponents: true};
const MARK_UP_PROPS = {text: 'text', hasMarkup: true, hasComponents: false};
const PLAIN_TEXT_PROPS = {text: 'text', hasMarkup: false, hasComponents: false};

describe('Renderers tests', () => {
	describe('getRenderers', () => {
		test('returns Complex', () => {
			expect(getRenderer(COMPLEX_PROPS)).toBe(Complex);
		});

		test('returns Markup', () => {
			expect(getRenderer(MARK_UP_PROPS)).toBe(Markup);
		});

		test('returns PlainText', () => {
			expect(getRenderer(PLAIN_TEXT_PROPS)).toBe(PlainText);
		});
	});
});