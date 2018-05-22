import React from 'react';
import PropTypes from 'prop-types';

const EMPTY = () => null;

TableHeader.propTypes = {
	columns: PropTypes.arrayOf(PropTypes.func).isRequired,
	component: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	extraProps: PropTypes.object
};
export default function TableHeader ({columns, component = 'tr', extraProps = {}, ...otherProps}) {
	const Cmp = component;
	const InnerCmp = component === 'tr' ? 'th' : 'div';

	return (
		<Cmp {...otherProps} >
			{columns.map(({HeaderComponent = EMPTY, cssClassName}, i) => {
				return (
					<InnerCmp key={i} className={cssClassName}>
						<HeaderComponent {...extraProps} />
					</InnerCmp>
				);
			})}
		</Cmp>
	);
}