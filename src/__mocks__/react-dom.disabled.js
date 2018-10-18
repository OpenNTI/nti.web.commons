/* eslint-env jest */
/* eslint no-console: 0, import/no-commonjs: 0 */

const React = require('react');
const reactDom = jest.genMockFromModule('react-dom');

function mockCreatePortal (element, target) {
	return (
		<div data-type="portal" data-target-tag-name={target.tagName}>
			{element}
		</div>
	);
}

module.exports = Object.assign(reactDom, {
	createPortal: mockCreatePortal
});
