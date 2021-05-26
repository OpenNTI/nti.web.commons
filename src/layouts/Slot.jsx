import React from 'react';
import PropTypes from 'prop-types';

const Matchers = {
	string:
		slot =>
		({ props: { slot: slotProp } }) =>
			slot === slot,

	function:
		slot =>
		({ type }) =>
			type === slot,
};

function buildMatchFn(slot) {
	const matcher = Matchers[typeof slot];

	if (!matcher) {
		throw new Error('Unknown slot value');
	}

	return matcher(slot);
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
export const Slot = ({ slot, children }) => (
	<>{React.Children.toArray(children).filter(buildMatchFn(slot))}</>
);

Slot.exists = (slot, children) =>
	React.Children.toArray(children).some(buildMatchFn(slot));

Slot.propTypes = {
	slot: PropTypes.string,
	children: PropTypes.any,
};
