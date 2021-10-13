/* eslint-env jest */
import TestRenderer from 'react-test-renderer';

import { Slot } from '../Slot';

const Aside = props => <div className="aside" {...props} />;

const Sample = props => (
	<section>
		<header>
			<Slot {...props} slot="header" />
		</header>
		<nav>
			<Slot {...props} slot="nav" />
		</nav>
		<aside>
			<Slot {...props} slot={Aside} />
		</aside>
		<p>
			<Slot {...props} slot="p" />
		</p>
		<footer>
			<Slot {...props} slot="footer" />
		</footer>
		<div className="unslotted">
			<Slot
				{...props}
				exclude={['header', 'nav', 'p', 'footer', Aside]}
			/>
		</div>
	</section>
);

const SlottedDiv = ({ slot, ...other }) => <div className={slot} {...other} />;

const SampleLayout = () => (
	<Sample>
		<SlottedDiv slot="header">Header</SlottedDiv>
		<SlottedDiv slot="nav">Nav</SlottedDiv>
		<Aside>Aside</Aside>
		<SlottedDiv slot="p">P</SlottedDiv>
		<SlottedDiv slot="footer">Footer</SlottedDiv>
		<span>Unslotted</span>
		<span>Unslotted</span>
		<span>Unslotted</span>
	</Sample>
);

describe('Slot Component', () => {
	describe('statics', () => {
		const named = <div slot="named" id="named" />;
		const cmp = <Aside id="cmp" />;
		const unslotted = <div id="unslotted" />;
		const children = [named, cmp, unslotted];

		describe('exists', () => {
			test('existing named', () =>
				expect(Slot.exists('named', children)).toBeTruthy());

			test('missing name', () =>
				expect(Slot.exists('non-existent', children)).toBeFalsy());

			test('existing cmp', () =>
				expect(Slot.exists(Aside, children)).toBeTruthy());

			test('missing cmp', () =>
				expect(Slot.exists(SampleLayout, children)).toBeFalsy());
		});

		describe('find', () => {
			test('existing named', () =>
				expect(Slot.find('named', children).props.id).toBe('named'));

			test('missing name', () =>
				expect(Slot.find('non-existent', children)).toBeUndefined());

			test('existing cmp', () =>
				expect(Slot.find(Aside, children).props.id).toBe('cmp'));

			test('missing cmp', () =>
				expect(Slot.find(SampleLayout, children)).toBeUndefined());
		});

		describe('order', () => {
			test('finds all children', () =>
				expect(
					Slot.order(['named', Aside, 'unused'], children).length
				).toBe(3));

			test('finds in children order', () => {
				const order = Slot.order([Aside, 'named'], children);

				expect(order).toEqual(['named', Aside, undefined]);
			});
		});
	});

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

		['header', 'nav', 'p', 'footer'].forEach(checkSlot);

		expect(() => byType(Aside)).not.toThrow();
		expect(() => byClassName('aside', byType(Aside))).not.toThrow();

		expect(byClassName('unslotted').findAllByType('span')).toHaveLength(3);
	});

	test('non-excluded unknown slots get included', () => {
		const testRender = TestRenderer.create(
			<Sample>
				<SlottedDiv slot="missing">Missing</SlottedDiv>
			</Sample>
		);

		const unslotted = testRender.root.find(
			t => t.props.className === 'unslotted'
		);

		expect(() => unslotted.findByType(SlottedDiv)).not.toThrow();
	});

	test('detects presence of children for the given slot', () => {
		const foo = <SlottedDiv key="foo" slot="foo" />;
		expect(Slot.exists('foo', [foo])).toBe(true);
		expect(Slot.exists('bar', [foo])).toBe(false);
	});
});
