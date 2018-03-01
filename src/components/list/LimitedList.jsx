import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';

const noop = () => {};

const DEFAULT_TEXT = {
	loadMore: {
		one: 'and %(count)s More...',
		other: 'and %(count)s More...'
	}
};

const t = scoped('common.components.lists.limited', DEFAULT_TEXT);

LimitedList.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	onShowMore: PropTypes.func,
	max: PropTypes.number,
	getString: PropTypes.func
};
export default function LimitedList ({children, className = () => {}, onShowMore, max = Infinity, getString, ...otherProps}) {
	const renderableChildren = React.Children.toArray(children)
		.filter(x => x !== false && x != null);

	const hasLimit = max !== Infinity;
	const items = hasLimit ? renderableChildren.slice(0, max) : renderableChildren;
	const remaining = hasLimit ? (renderableChildren.length - max) : 0;
	const cls = cx('limited-list', className);
	const remainingCls = cx('remaining', {'has-handler': !!onShowMore});
	const stringFn = getString ? t.override(getString) : t;

	return (
		<ul className={cls} {...otherProps}>
			{items.map((x, index) => (<li key={index}>{x}</li>))}
			{!!remaining && remaining > 0 && (<li className={remainingCls} onClick={onShowMore || noop}>{stringFn('loadMore', {count: remaining})}</li>) }
		</ul>
	);
}
