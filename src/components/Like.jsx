import PropTypes from 'prop-types';
import cx from 'classnames';

import { Button, useChanges } from '@nti/web-core';

import './Like.scss';

Like.propTypes = {
	item: PropTypes.object.isRequired,
	asButton: PropTypes.bool,
};

export default function Like({ item, asButton }) {
	useChanges(item);

	const { LikeCount } = item;

	const onClick = e => {
		e.preventDefault();
		e.stopPropagation();

		item.like();
	};

	let count = LikeCount || '';

	let cls = cx('like', {
		active: item.hasLink('unlike'),
		'button-like': asButton,
		count: !!count,
	});

	const Tag = asButton ? Button : 'a';
	const extraProps = asButton ? { plain: true } : { href: '#' };

	return (
		<Tag {...extraProps} className={cls} onClick={onClick}>
			{count}
		</Tag>
	);
}
