import React from 'react';
import PropTypes from 'prop-types';

SequenceItem.propTypes = {
	children: PropTypes.any,
};
export default function SequenceItem({ children, ...otherProps }) {
	const child = React.Children.only(children);

	delete otherProps.showFor;

	return child;
}
