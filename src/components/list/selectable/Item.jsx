import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Styles.css';
import {SelectableItemProp} from './Constants';
import Context from './Context';

const cx = classnames.bind(Styles);

SelectableItem.propTypes = {
	as: PropTypes.any,

	id: PropTypes.string,
	value: PropTypes.any.isRequired,

	className: PropTypes.string,
	focusedClassName: PropTypes.string,
	selectedClassName: PropTypes.string
};
export default function SelectableItem ({as: tag, id: idProp, value, className, focusedClassName, selectedClassName, ...otherProps}) {
	const Cmp = tag || 'li';

	const [id, setId] = React.useState(null);
	const SelectableContext = React.useContext(Context);

	if (!SelectableContext) { throw new Error('Cannot use Selectable Item outside of a Selectable List.'); }

	React.useEffect(() => {
		const itemId = idProp || SelectableContext.getItemId();

		SelectableContext.addItem(itemId, value);
		setId(itemId);

		return () => {
			SelectableContext.removeItem(itemId);
		};
	}, [idProp, value]);

	const focused = SelectableContext.isFocused(id);
	const selected = SelectableContext.isSelected(id);

	const itemProps = {
		className: cx(
			className,
			'selectable-item',
			{
				[focusedClassName || 'focused-item']: focused,
				[selectedClassName || 'selected-item']: selected
			}
		)
	};

	if (id) {
		itemProps[SelectableItemProp] = id;
		itemProps.onMouseDown = (e) => {
			e.preventDefault();
			e.stopPropagation();

			SelectableContext?.setSelected(id);
		};
	}

	return (
		<Cmp
			{...otherProps}
			{...itemProps}
			role="listitem"
		/>
	);
}