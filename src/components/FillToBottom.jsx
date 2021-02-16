import React from 'react';
import PropTypes from 'prop-types';

const Property = '--fill-to-bottom-height';

FillToBottom.propTypes = {
	padding: PropTypes.number,
	limit: PropTypes.bool,
	style: PropTypes.object,
	property: PropTypes.string,

	as: PropTypes.any,
};
export default function FillToBottom({
	padding = 20,
	limit,
	property: propertyProp,
	as: tag,
	style: styleProp,
	...otherProps
}) {
	const Cmp = tag || 'div';
	const style = { ...styleProp };
	const property = propertyProp ?? (limit ? 'height' : 'minHeight');

	style[property] = `var(${Property})`;

	const attachRef = node => {
		if (node) {
			const { top } = node?.getBoundingClientRect() ?? {};

			node.style.setProperty(
				Property,
				`calc(100vh - ${padding ?? 0}px - ${top ?? 0}px`
			);
		}
	};

	return <Cmp ref={attachRef} style={style} {...otherProps} />;
}
