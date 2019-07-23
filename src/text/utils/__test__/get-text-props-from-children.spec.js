/* eslint-env jest */
import React from 'react';
import PropTypes from 'prop-types';
import {render} from '@testing-library/react';

import getTextPropsFromChildren from '../get-text-props-from-children';

function SimpleElement () {
	return (<span>Simple Element</span>);
}

class TestCmp extends React.Component {
	static propTypes = {
		callback: PropTypes.func,
		children: PropTypes.any
	}

	componentDidMount () {
		const {callback, children} = this.props;

		callback(getTextPropsFromChildren(children));
	}


	render () {
		return null;
	}
}

function getTextProps (children) {
	return new Promise((fulfill) => {
		const callback = (textProps) => fulfill(textProps);

		render(<TestCmp callback={callback}>{children}</TestCmp>);
	});
}

describe('getTextPropsFromChildren', () => {
	test('simple string', async () => {
		const test = 'simple text';
		const {text, hasMarkup, hasComponents} = await getTextProps(test);

		expect(text).toBe(test);
		expect(hasMarkup).toBeFalsy();
		expect(hasComponents).toBeFalsy();
	});

	test('hasMarkup if all tags are white listed', async () => {
		const {text, hasMarkup, hasComponents} = await getTextProps(
			<a>This <b>is</b> a <i>test</i></a>
		);

		expect(text).toBe('<a>This <b>is</b> a <i>test</i></a>');
		expect(hasMarkup).toBeTruthy();
		expect(hasComponents).toBeFalsy();
	});

	test('hasComponents if tags aren\'t white listed', async () => {
		const {hasMarkup, hasComponents} = await getTextProps(
			<section>Not White Listed</section>
		);

		expect(hasMarkup).toBeFalsy();
		expect(hasComponents).toBeTruthy();
	});

	test('hasComponents if a child is a react element', async () => {
		const {hasMarkup, hasComponents} = await getTextProps(<SimpleElement />);

		expect(hasMarkup).toBeFalsy();
		expect(hasComponents).toBeTruthy();
	});

	test('hasComponents if a nested child is a react element', async () => {
		const {hasMarkup, hasComponents} = await getTextProps(
			<a>test <SimpleElement /></a>
		);

		expect(hasMarkup).toBeFalsy();
		expect(hasComponents).toBeTruthy();
	});

	test('markup has only white listed attributes', async () => {
		const {text, hasMarkup, hasComponents} = await getTextProps(
			<a href="link" attr="test">Link</a>
		);

		expect(text).toBe('<a href="link">Link</a>');
		expect(hasMarkup).toBeTruthy();
		expect(hasComponents).toBeFalsy();
	});
});