import React from 'react';
import PropTypes from 'prop-types';

BaseImage.propTypes = {
	src: PropTypes.string.isRequired,
	alt: PropTypes.string.isRequired,
	children: PropTypes.any,
	childProp: PropTypes.string,
	childProps: PropTypes.func,
	imageRef: PropTypes.func
};
export default function BaseImage ({src, alt, children, childProp = 'src', childProps, imageRef, ...otherProps}) {
	const child = children && React.Children.only(children);

	if (child) {
		const props = childProps ? childProps(src) : {[childProp]: src};
		return (React.cloneElement(child, {...props, ref: imageRef}));
	}

	delete otherProps.aspectRatio;
	return (
		<img src={src} alt={alt} ref={imageRef} {...otherProps} />
	);
}
