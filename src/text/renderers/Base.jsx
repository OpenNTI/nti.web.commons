import React from 'react';
import PropTypes from 'prop-types';


NTIBaseText.propTypes = {
	tag: PropTypes.any,
	text: PropTypes.string,
	textRef: PropTypes.func
};
function NTIBaseText ({tag, textRef, text, ...otherProps}) {
	const Cmp = tag || 'span';

	return (
		<Cmp {...otherProps} ref={textRef}>
			{text}
		</Cmp>
	);
}

const Text = (props, ref) => {
	return (
		<NTIBaseText {...props} textRef={ref} />
	);
};

export default React.forwardRef(Text);