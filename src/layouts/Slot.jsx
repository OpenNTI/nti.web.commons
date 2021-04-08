import React from 'react';
import PropTypes from 'prop-types';

export const Slot = ({ slot, children }) => (
	<>
		{React.Children.toArray(children).filter(
			({ props: { slot: s } }) => s === slot
		)}
	</>
);

Slot.exists = (slot, children) =>
	React.Children.toArray(children).some(c => c.slot === slot);

Slot.propTypes = {
	slot: PropTypes.string,
	children: PropTypes.any,
};
