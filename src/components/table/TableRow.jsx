import React from 'react';
import PropTypes from 'prop-types';

TableRow.propTypes = {
	columns: PropTypes.arrayOf(PropTypes.func),
	item: PropTypes.object,
	component: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	extraProps: PropTypes.object
};
export default function TableRow ({columns, item, component = 'tr', extraProps = {}, ...otherProps}) {
	const Cmp = component;
	const InnerCmp = component === 'tr' ? 'td' : 'div';

	return (
		<Cmp {...otherProps} >
			{columns.map((Cell, cell) => {
				return (
					<InnerCmp key={cell} className={Cell.cssClassName}>
						<Cell item={item} {...extraProps} />
					</InnerCmp>
				);
			})}
		</Cmp>
	);
}
