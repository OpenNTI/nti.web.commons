/* eslint-env jest */
import React from 'react';
import TestRenderer from 'react-test-renderer';

import { Slot } from '../Slot';

const Sample = props => (
	<section>
		<header>
			<Slot {...props} slot="header" />
		</header>
		<nav>
			<Slot {...props} slot="nav" />
		</nav>
		<aside>
			<Slot {...props} slot="aside" />
		</aside>
		<p>
			<Slot {...props} slot="p" />
		</p>
		<footer>
			<Slot {...props} slot="footer" />
		</footer>
		<div className="unslotted">
			<Slot {...props} />
		</div>
	</section>
);

const SlottedDiv = ({ slot, ...other }) => <div className={slot} {...other} />;

const SampleLayout = () => (
	<Sample>
		<SlottedDiv slot="header">Header</SlottedDiv>
		<SlottedDiv slot="nav">Nav</SlottedDiv>
		<SlottedDiv slot="aside">Aside</SlottedDiv>
		<SlottedDiv slot="p">P</SlottedDiv>
		<SlottedDiv slot="footer">Footer</SlottedDiv>
		<span>Unslotted</span>
		<span>Unslotted</span>
		<span>Unslotted</span>
	</Sample>
);

describe('Slot Component', () => {
	test('snapshot', () => {
		const testRender = TestRenderer.create(<SampleLayout />);
		expect(testRender.toJSON()).toMatchSnapshot();
	});

	test('renders children into the correct slots', () => {
		const testRender = TestRenderer.create(<SampleLayout />);

		const byClassName = (className, parent = testRender.root) =>
			parent.find(t => t.props.className === className);

		const byType = (type, parent = testRender.root) =>
			parent.findByType(type);

		const checkSlot = slot => {
			expect(() => byType(slot)).not.toThrow(); // should exist; e.g. <header>...</header>
			const el = byType(slot); // e.g. <header>...</header>

			expect(() => byClassName(slot, el)).not.toThrow(); // should exist; e.g. <div className="header">Header</div>
			const headerContent = byClassName(slot, el); // e.g. <div className="header">Header</div>;
			expect(headerContent.children[0]?.toLowerCase?.()).toEqual(slot); // text content
		};

		['header', 'nav', 'aside', 'p', 'footer'].forEach(checkSlot);

		expect(byClassName('unslotted').findAllByType('span')).toHaveLength(3);
	});

	test('omits nonmatching slots', () => {
		const testRender = TestRenderer.create(
			<Sample>
				<SlottedDiv slot="missing">Missing</SlottedDiv>
			</Sample>
		);

		expect(() =>
			testRender.root.find(x => x.props.className === 'missing')
		).toThrow(); // not found; should throw.
	});

	test('detects presence of children for the given slot', () => {
		const foo = <SlottedDiv key="foo" slot="foo" />;
		expect(Slot.exists('foo', [foo])).toBe(true);
		expect(Slot.exists('bar', [foo])).toBe(false);
	});
});
