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

function buildMatchFn(slot, exclude) {
	if (exclude) {
		return Array.isArray(exclude)
			? buildMatchers(exclude, true)
			: buildMatcher(exclude, true);
	}

	return Array.isArray(slot) ? buildMatchers(slot) : buildMatcher(slot);
}

/*
 * This component provides a mechanism by which a parent component
 * can render provided children into designated 'slots' in its markup
 *
 * const Parent = (props) => (
 * 	<section>
 * 		<header>
 * 			<Slot slot="header" {...props} /> <== render children with a slot="header" prop here
 * 		</header>
 * 		<Slot {...props} /> <== render children without a slot prop here
 * 	</section>
 * )
 *
 * <Parent>
 * 		<h1 slot="header">{pageTitle}</h1> <== gets rendered into Parent's <header> element
 * </Parent>
 */
export const Slot = ({ slot, exclude, children }) => {
	const matched = React.useMemo(
		() =>
			React.Children.toArray(children).filter(
				buildMatchFn(slot, exclude)
			),
		[children, slot, exclude]
	);

	return matched;
};

Slot.find = (slot, children) =>
	React.Children.toArray(children).find(buildMatchFn(slot));

Slot.exists = (slot, children) =>
	React.Children.toArray(children).some(buildMatchFn(slot));

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

const SlotType = PropTypes.oneOfType([PropTypes.string, PropTypes.function]);
const SlotListType = PropTypes.oneOfType(
	[PropTypes.arrayOf(SlotType)],
	SlotType
);

Slot.propTypes = {
	slot: SlotListType,
	exclude: SlotListType,
	children: PropTypes.any,
};
