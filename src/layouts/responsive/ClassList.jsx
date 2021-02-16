import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Monitor } from '../../components';

ResponsiveClassList.propTypes = {
	className: PropTypes.string,
	classList: PropTypes.arrayOf(
		PropTypes.shape({
			query: PropTypes.func,
			className: PropTypes.string,
		})
	),
};
export default function ResponsiveClassList({
	className,
	classList,
	...otherProps
}) {
	const [activeClasses, setActiveClasses] = React.useState([]);

	const onSizeChange = React.useCallback(
		size => {
			setActiveClasses(
				classList.reduce((acc, item) => {
					if (item?.query?.(size)) {
						acc.push(item.className);
					}

					return acc;
				}, [])
			);
		},
		[classList]
	);

	return (
		<Monitor.ElementSize
			{...otherProps}
			className={cx(className, ...activeClasses)}
			onChange={onSizeChange}
		/>
	);
}
