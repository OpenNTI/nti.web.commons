import './LimitedInline.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import {ForwardRef} from '../../decorators';

import {getParts, RENDERERS} from './InlineUtils';

const DEFAULT_TEXT = {
	remaining: {
		one: '%(count)s Other',
		other: '%(count)s Others'
	},
	separator: ', ',
	label: {
		//This makes use of the pluralization of the count of list items to get the appropriate commas or not
		remaining: {
			one: '{list} and {remaining}',
			other: '{list}, and {remaining}'
		},
		single: '{list}'
	},
	empty: 'None'
};

const t = scoped('common.components.lists.inline', DEFAULT_TEXT);


InlineList.propTypes = {
	children: PropTypes.node,
	limit: PropTypes.number,
	getString: PropTypes.func,
	renderOverrides: PropTypes.object,
	listRef: PropTypes.any
};
function InlineList ({children, limit = 1, getString, renderOverrides = {}, listRef, ...otherProps}) {
	const renderableChildren = React.Children.toArray(children)
		.filter(x => x !== false && x != null);

	if (renderableChildren.length === 0) {
		return t('empty');
	}

	const override = getString ? t.override(getString) : t;

	const list = renderableChildren.length === 2 || renderableChildren.length < limit
		? renderableChildren
		: renderableChildren.slice(0, limit);

	const remaining = renderableChildren.length - list.length;
	const parts = getParts(list, remaining, override);


	const renders = parts.reduce((acc, part, index) => {
		let render;

		if (renderOverrides[part]) {
			render = renderOverrides[part](list, remaining, override, renderOverrides, index);
		} else if (RENDERERS[part]) {
			render = RENDERERS[part](list, remaining, override, renderOverrides, index);
		} else if (part) {
			render = (<span key={index}>{part}</span>);
		}

		if (Array.isArray(render)) {
			acc = acc.concat(render);
		} else if (render) {
			acc.push(render);
		}

		return acc;
	}, []);

	return (
		<div className="inline-list" {...otherProps} ref={listRef} >
			{renders}
		</div>
	);
}

export default ForwardRef('listRef')(InlineList);
