/* eslint-env jest */
export function mockComputedStyle (styles) {
	let oldComputedStyle;

	beforeEach(() => {
		oldComputedStyle = global.getComputedStyle;

		global.getComputedStyle = () => styles;
	});

	afterEach(() => {
		global.getComputedStyle = oldComputedStyle;
	});
}