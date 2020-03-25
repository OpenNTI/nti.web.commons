/* eslint-env jest */

import getViewportRelativeAlignments from '../get-viewport-relative-alignments';

describe('getViewportRelativeAlignemnts', () => {
	test('getViewportRelativeAlignments', () => {
		const viewport = {width: 1024, height: 768};

		document.body.innerHTML = `
			<div>
				<div id=target></div>
			</div>
		`;
		const div = document.getElementById('target');
		Object.defineProperty(div, 'getBoundingClientRect', {value: () => ({
			top: 100,
			left: 50,
			bottom: 700,
			right: 250,
			width: 200,
			height: 600,
		})});

		expect(getViewportRelativeAlignments(div, {}, viewport)).toMatchSnapshot();
		expect(getViewportRelativeAlignments(div, {top: 1, left: 1, right: 1, bottom: 1}, viewport)).toMatchSnapshot();
		expect(getViewportRelativeAlignments(div, {top: 1, left: 1}, viewport)).toMatchSnapshot();
		expect(getViewportRelativeAlignments(div, {bottom: 1, right: 1}, viewport)).toMatchSnapshot();
		expect(getViewportRelativeAlignments(div, {top: 1}, viewport)).toMatchSnapshot();
		expect(getViewportRelativeAlignments(div, {bottom: 1}, viewport)).toMatchSnapshot();
		expect(getViewportRelativeAlignments(div, {left: 1}, viewport)).toMatchSnapshot();
		expect(getViewportRelativeAlignments(div, {right: 1}, viewport)).toMatchSnapshot();
	});
});