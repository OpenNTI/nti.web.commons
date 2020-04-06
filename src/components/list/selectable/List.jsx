import React from 'react';
import PropTypes from 'prop-types';

import {SelectableItemProp} from './Constants';
import Context from './Context';
import Item from './Item';

function getNextId () {
	getNextId.seenCount = (getNextId.seenCount || 0) + 1;

	return `selectable-item-${getNextId.seenCount}`;
}

function getSelectableItemIds (list) {
	return Array
		.from(list.querySelectorAll(`[${SelectableItemProp}]`))
		.map(item => item.getAttribute(SelectableItemProp));
}

function getArrayNextItem (items, focused, direction) {
	const up = direction < 0;
	const down = direction > 0;

	const first = items[0];
	const last = items[items.length - 1];

	const index = items.indexOf(focused);

	if (up && index <= 0) { return last; }
	if (down && index < 0) { return first; }
	if (down && index >= items.length - 1) { return first; }

	return items[index + direction];
}

function stop (e) {
	e.stopPropagation();
	e.preventDefault();
}

SelectableList.Item = Item;
SelectableList.propTypes = {
	as: PropTypes.any,
	useGlobalListeners: PropTypes.bool
};
export default function SelectableList ({as: tag, useGlobalListeners, ...otherProps}) {
	const Cmp = tag || 'ul';
	const cmpRef = React.useRef();
	const cmpProps = {
		ref: cmpRef
	};

	const [focused, setFocused] = React.useState(null);

	const context = {
		getItemId: () => getNextId(),
		focused
	};

	const focusNextItem = () => {
		if (!cmpRef.current) { return; }

		const items = getSelectableItemIds(cmpRef.current);

		setFocused(getArrayNextItem(items, focused, 1));
	};

	const focusPreviousItem = () => {
		if (!cmpRef.current) { return; }

		const items = getSelectableItemIds(cmpRef.current);

		setFocused(getArrayNextItem(items, focused, -1));
	};

	const onKeyDown = (e) => {
		if (e.key === 'ArrowDown') {
			stop(e);
			focusNextItem();
		} else if (e.key === 'ArrowUp') {
			stop(e);
			focusPreviousItem();
		}
	};

	React.useEffect(() => {
		if (!useGlobalListeners) { return () => {}; }

		global.document?.addEventListener('keydown', onKeyDown);

		return () => {
			global.document?.removeEventListener('keydown', onKeyDown);
		};
	});

	if (!useGlobalListeners) {
		cmpProps.tabIndex = 0;
		cmpProps.onKeyDown = onKeyDown;
	}

	return (
		<Context.Provider value={context}>
			<Cmp {...otherProps} ref={cmpRef} {...cmpProps} />
		</Context.Provider>
	);
}