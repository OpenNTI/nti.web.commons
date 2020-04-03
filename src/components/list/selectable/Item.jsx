import React from 'react';
import PropTypes from 'prop-types';

import {SelectableItemProp} from './Constants';
import Context from './Context';

SelectableItem.propTypes = {
	as: PropTypes.any,
	value: PropTypes.any
};
export default function SelectableItem ({as: tag, value, ...otherProps}) {
	const Cmp = tag || 'li';

	const [id, setId] = React.useState(null);
	const SelectableContext = React.useContext(Context);

	if (!SelectableContext) { throw new Error('Cannot use Selectable Item outside of a Selectable List.'); }

	React.useEffect(() => {
		const itemId = SelectableContext.getItemId();

		setId(itemId);
	}, []);

	const itemProps = {};

	if (id) {
		itemProps[SelectableItemProp] = id;
	}

	return (
		<Cmp {...otherProps} {...itemProps} />
	);
}