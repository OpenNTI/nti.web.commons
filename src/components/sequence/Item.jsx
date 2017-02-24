import React from 'react';

SequenceItem.propTypes = {
	children: React.PropTypes.any
};
export default function SequenceItem ({children, ...otherProps}) {
	const child = React.Children.only(children);

	delete otherProps.showFor;

	return child;
}
