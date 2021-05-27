/** @typedef {string|React.ReactElement} SlotIdentifier - either a name or React component */
/** @typedef {SlotIdentifier|[SlotIdentifier]} Slot */
/** @typedef {(cmp: React.ReactElement) => boolean} Matcher */

import React from 'react';
import PropTypes from 'prop-types';

const Matchers = {
	string:
		slot =>
		({ type, props: { slot: slotProp } }) =>
			slotProp === slot || type.slot === slot,

	function:
		slot =>
		({ type }) =>
			type === slot,

	undefined:
		() =>
		({ props: { slot } }) =>
			!slot,
};

function buildMatcher(slot, inverse) {
	const matcher = Matchers[typeof slot]?.(slot);

	if (!matcher) {
		throw new Error('Unknown slot value');
	}

	return inverse
		? (...args) => {
				return !matcher(...args);
		  }
		: matcher;
}

function buildMatchers(slots, inverse) {
	const matchers = slots.map(s => buildMatcher(s, inverse));

	return (...args) => matchers.every(m => m(...args));
}

/**
 * Generate a matcher for the given slot identifiers
 *
 * @private
 * @param {Slot} slot
 * @param {boolean} inverse
 * @returns {Matcher}
 */
export function buildMatchFn(slot, inverse) {
	return Array.isArray(slot)
		? buildMatchers(slot, inverse)
		: buildMatcher(slot, inverse);
}

/**
 * This component provides a mechanism by which a parent component
 * can render provided children into designated 'slots' in its markup
 *
 * Types of Slot identifiers:
 * 1.) String - looks for the child with a 'slot' prop === the slot identifier
 *
 * 		const Parent = (props) => (
 * 			<section>
 * 				<header>
 * 					<Slot slot="header" {...props} /> <== render children with a slot="header" prop here
 * 				</header>
 * 				<Slot {...props} /> <== render children without a slot prop here
 * 			</section>
 * 		)
 *
 * 		<Parent>
 * 			<h1 slot="header">{pageTitle}</h1> <== gets rendered into Parent's <header> element
 * 		</Parent>
 *
 * 2.) Component - looks for a child with a type === the slot identifier
 *
 * 		const SubCmpFooter = () => (<div>Sub Component Footer!</div>);
 * 		const Parent = (props) => (
 * 			<section>
 * 				<Slot exclude={SubCmpFooter} />
 * 				<Slot slot={SubCmpFooter} />
 * 			</section
 * 		);
 *
 * 		<Parent>
 * 			<SubCmpFooter />
 * 			<div>
 * 				Arbitrary Content
 * 			</div>
 * 		</Parent>
 *
 * Matchers:
 * 1.) slot - look for children that matches the slot identifer
 * 1a) [slot] - look for children that match one of the slot identifiers
 * 2.) exclude - look for children that do not match the slot identifier
 * 2a.) [exclude] - look for children that do not match any of the slot identifiers
 *
 * @param {{slot:Slot, exclude: Slot}} props
 * @returns {JSX.Element}
 */
export const Slot = ({ slot, exclude, children }) => {
	const matched = React.useMemo(
		() =>
			React.Children.toArray(children).filter(
				exclude ? buildMatchFn(exclude, true) : buildMatchFn(slot)
			),
		[children, slot, exclude]
	);

	return matched;
};


/**
 * Find the first child that matches the slot
 *
 * @param {Slot} slot
 * @param {React.Children} children
 * @returns {React.ReactElement}
 */
Slot.find = (slot, children) =>
	React.Children.toArray(children).find(buildMatchFn(slot));

/**
 * Determine if a slot exists in children
 *
 * @param {Slot} slot
 * @param {React.Children} children
 * @returns {boolean}
 */
Slot.exists = (slot, children) =>
	React.Children.toArray(children).some(buildMatchFn(slot));

/**
 * Return the order of a given set of slots used in a children
 *
 * @param {Slot} slots
 * @param {React.Children} children
 * @returns {[{slot:Slot, child: React.ReactElement}]}
 */
Slot.order = (slots, children) => {
	const childList = React.Children.toArray(children);
	const matchers = slots.map(slot => ({
		slot,
		matches: buildMatchFn(slot),
	}));

	return childList.map((child, ...args) => {
		const slot =
			matchers.find(m => m.matches(child, ...args))?.slot ?? undefined;

		return {
			slot,
			child,
		};
	});
};
