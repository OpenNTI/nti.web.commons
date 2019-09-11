import React from 'react';
import PropTypes from 'prop-types';

BaseImage.propTypes = {
	src: PropTypes.string.isRequired,
	alt: PropTypes.string.isRequired,
	children: PropTypes.any,
	childProp: PropTypes.string,
	imageRef: PropTypes.func
};
export default function BaseImage ({src, alt, children, childProp = 'src', imageRef, ...otherProps}) {
	const child = children && React.Children.only(children);

	if (child) {
		return (React.cloneElement(child, {[childProp]: src, ref: imageRef}));
	}

	return (
		<img src={src} alt={alt} ref={imageRef} {...otherProps} />
	);
}