import React from 'react';
import {scoped} from 'nti-lib-locale';

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
			one: '{list} & {remaining}',
			other: '{list}, & {remaining}'
		},
		single: '{list}'
	},
	empty: 'None'
};

const t = scoped('INLINE_LIST', DEFAULT_TEXT);


InlineList.propTypes = {
	children: React.PropTypes.node,
	limit: React.PropTypes.number,
	getString: React.PropTypes.func,
	renderOverrides: React.PropTypes.object
};
export default function InlineList ({children, limit = 1, getString, renderOverrides = {}}) {
	children = React.Children.toArray(children);

	if (children.length === 0) {
		return t('empty');
	}

	const override = getString ? t.override(getString) : t;

	const list = children.slice(0, limit);
	const remaining = children.length - list.length;
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
		<div className="inline-list">
			{renders}
		</div>
	);
}
