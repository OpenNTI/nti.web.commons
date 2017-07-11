import React from 'react';
import cx from 'classnames';

export function getParts (list, remaining, getString) {
	const onlyTwo = list.length === 2;
	let name = 'label';
	let data = {};

	if (list.length === 1 && !remaining) {
		name = `${name}.single`;
	} else {
		name = `${name}.remaining`;
		//This won't work for non English style pluralizes...
		data = {
			count: onlyTwo && !remaining ? 1 : list.length
		};
	}

	const label = getString(name, data);

	return label.split(/(\{[^\}]+\})/);
}


function renderItem (item, key, remaining) {
	const cls = cx('item', {remaining});
	const title = typeof item === 'string' ? item : void 0;

	return (
		<span className={cls} key={key} title={title}>{item}</span>
	);
}


export const RENDERERS = {
	['{listItem}'] (item, getString, renderOverrides, key, remaining) {
		return renderOverrides['{listItem}'] ?
			renderOverrides['{listItem}'](item, getString, key, remaining) :
			renderItem(item, key, remaining);
	},


	['{list}'] (list, remaining, getString, renderOverrides, key) {
		//If there aren't any remaining the remaining rendered will render the last item
		if (!remaining && list.length > 1) {
			list = list.slice(0, -1);
		}

		return list.reduce((acc, item, index) => {
			const itemKey = `${key}-${index}`;

			if (index !== 0) {
				acc.push((<span className="separator" key={`${itemKey}-seperator`}>{getString('separator')}</span>));
			}

			acc.push(RENDERERS['{listItem}'](item, getString, renderOverrides, itemKey));

			return acc;
		}, []);
	},


	['{remaining}'] (list, remaining, getString, renderOverrides, key) {
		if (!remaining && list.length > 1) {
			return RENDERERS['{listItem}'](list[list.length - 1], getString, renderOverrides, key, true);
		}

		return remaining && (<span className="remaining" key={key}>{getString('remaining', {count: remaining})}</span>);
	}
};
