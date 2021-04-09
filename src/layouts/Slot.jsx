import React from 'react';
import PropTypes from 'prop-types';

const matchFn = slot => ({ props: { slot: s } }) => (!slot ? !s : s === slot);

export const Slot = ({ slot, children }) => (
	<>{React.Children.toArray(children).filter(matchFn(slot))}</>
);

Slot.exists = (slot, children) =>
	React.Children.toArray(children).some(matchFn(slot));

Slot.propTypes = {
	slot: PropTypes.string,
	children: PropTypes.any,
};
