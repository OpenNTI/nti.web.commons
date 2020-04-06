import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Styles.css';
import {SelectableItemProp} from './Constants';
import Context from './Context';

const cx = classnames.bind(Styles);

SelectableItem.propTypes = {
	as: PropTypes.any,
	value: PropTypes.any,
	className: PropTypes.string,
	focusedClassName: PropTypes.string
};
export default function SelectableItem ({as: tag, value, className, focusedClassName, ...otherProps}) {
	const Cmp = tag || 'li';

	const [id, setId] = React.useState(null);
	const SelectableContext = React.useContext(Context);

	if (!SelectableContext) { throw new Error('Cannot use Selectable Item outside of a Selectable List.'); }

	React.useEffect(() => {
		const itemId = SelectableContext.getItemId();

		setId(itemId);
	}, []);

	const focused = id === SelectableContext.focused;
	const itemProps = {};

	if (id) {
		itemProps[SelectableItemProp] = id;
	}

	return (
		<Cmp
			{...otherProps}
			{...itemProps}
			className={cx(className, cx('selectable-item'), {[focusedClassName || cx('focused-item')]: focused})}
		/>
	);
}