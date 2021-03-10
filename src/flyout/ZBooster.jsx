import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { getMaxZIndex } from '@nti/lib-dom';

const ZBooster = React.forwardRef(({ as = 'div', targetEl, ...props }, ref) => {
	// getEffectiveZIndex(targetEl)
	const effectiveZ = useMemo(() => getMaxZIndex(), []);
	const style = {
		...props.style,
		zIndex: effectiveZ ? effectiveZ + 1 : void 0,
	};

	const Tag = as;

	return <Tag {...props} style={style} ref={ref} />;
});
ZBooster.displayName = 'ZBooster';
ZBooster.propTypes = {
	as: PropTypes.any,
	targetEl: PropTypes.instanceOf(HTMLElement),
	style: PropTypes.object,
};

export default ZBooster;
