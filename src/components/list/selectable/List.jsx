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
		isFocused: (id) => id && focused === id
	};

	const focusNextItem = () => {
		if (!cmpRef.current) { return; }

		const items = getSelectableItemIds(cmpRef.current);

		if (!focused) { setFocused(0); return; }

		debugger;
	};

	const focusPreviousItem = () => {

	};

	const onKeyDown = (e) => {
		if (e.key === 'ArrowDown') {
			focusNextItem();
		}
	};

	const onKeyUp = () => {
		debugger;
	};

	React.useEffect(() => {
		if (!useGlobalListeners) { return () => {}; }

		global.document?.addEventListener('keydown', onKeyDown);
		global.document?.addEventListener('keyup', onKeyUp);

		return () => {
			global.document?.removeEventListener('keydown', onKeyDown);
			global.document?.removeEventListener('keyup', onKeyUp);
		};
	}, [useGlobalListeners]);

	if (!useGlobalListeners) {
		cmpProps.tabIndex = 0;
		cmpProps.onKeyDown = onKeyDown;
		cmpProps.onKeyUp = onKeyUp;
	}

	return (
		<Context.Provider value={context}>
			<Cmp {...otherProps} ref={cmpRef} {...cmpProps} />
		</Context.Provider>
	);
}