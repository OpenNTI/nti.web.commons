import React from 'react';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';

const noop = () => {};

const DEFAULT_TEXT = {
	loadMore: {
		one: 'and %(count)s More...',
		other: 'and %(count)s More...'
	}
};

const t = scoped('LIMITED_LIST', DEFAULT_TEXT);

LimitedList.propTypes = {
	children: React.PropTypes.node,
	className: React.PropTypes.string,
	onShowMore: React.PropTypes.func,
	max: React.PropTypes.number,
	getString: React.PropTypes.func
};
export default function LimitedList ({children, className = () => {}, onShowMore, max = Infinity, getString, ...otherProps}) {
	children = React.Children.toArray(children);

	const hasLimit = max !== Infinity;
	const items = hasLimit ? children.slice(0, max) : children;
	const remaining = hasLimit ? (children.length - max) : 0;
	const cls = cx('limited-list', className);
	const remainingCls = cx('remaining', {'has-handler': !!onShowMore});
	const stringFn = getString ? t.override(getString) : t;

	return (
		<ul className={cls} {...otherProps}>
			{items.map((x, index) => (<li key={index}>{x}</li>))}
			{remaining && remaining > 0 && (<li className={remainingCls} onClick={onShowMore || noop}>{stringFn('loadMore', {count: remaining})}</li>) }
		</ul>
	);
}
