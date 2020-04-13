import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Variant from '../../../HighOrderComponents/Variant';

import Styles from './Styles.css';
import {getKeyDownHandler, getItemId} from './utils';
import Context from './Context';
import Item from './Item';

const cx = classnames.bind(Styles);

//TODO: Use this components in the select/token inputs

SelectableList.Unstyled = Variant(SelectableList, {className: cx('unstyled-list')}, 'Unstyled');
SelectableList.Item = Item;
SelectableList.propTypes = {
	as: PropTypes.any,
	controlledBy: PropTypes.any,
	selected: PropTypes.any,

	onSelectedChange: PropTypes.func,
	onFocusedChange: PropTypes.func
};
export default function SelectableList ({as: tag, controlledBy, selected, onSelectedChange, onFocusedChange, ...otherProps}) {
	const Cmp = tag || 'ul';
	const cmpRef = React.useRef();
	const cmpProps = {
		role: 'listbox'
	};

	const idsToValue = React.useRef({});
	const [focused, setFocused] = React.useState(null);

	const context = {
		getItemId: () => getItemId(),

		addItem: (id, value) => {
			idsToValue.current[id] = value;
		},

		removeItem: (id) => {
			delete idsToValue.current[id];
		},
		
		isFocused: (id) => id && id === focused,
		isSelected: (id) => {
			if (!selected) { return false; }

			const value = idsToValue.current[id];

			if (!Array.isArray(selected)) { return selected === value; }

			const selectedSet = new Set(selected);

			return selectedSet.has(value);
		}
	};

	const onKeyDown = getKeyDownHandler(
		cmpRef,
		{
			focused,
			setFocused: (newFocused) => {
				setFocused(newFocused);

				const value = idsToValue.current[newFocused];

				if (onFocusedChange) { onFocusedChange(value); }
			},

			selected,
			setSelected: (newSelected) => {
				const value = idsToValue.current[newSelected];
			
				if (onSelectedChange) {
					onSelectedChange(value);
				}
			}
		}
	);

	React.useEffect(() => {
		if (!controlledBy) { return; }

		const controller = controlledBy === global ? global.document : controlledBy;

		controller?.addEventListener('keydown', onKeyDown);

		return () => {
			controller?.removeEventListener('keydown', onKeyDown);
		};
	});

	if (!controlledBy) {
		cmpProps.tabIndex = 0;
		cmpProps.onKeyDown = onKeyDown;
	}

	return (
		<Context.Provider value={context}>
			<Cmp {...otherProps} {...cmpProps} ref={cmpRef} />
		</Context.Provider>
	);
}