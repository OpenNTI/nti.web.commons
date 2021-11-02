import PropTypes from 'prop-types';
import { useState } from 'react';
import cx from 'classnames';

import { Button, useChanges } from '@nti/web-core';

import Loading from './loading-indicators';

import './Like.scss';

Like.propTypes = {
	item: PropTypes.object.isRequired,
	asButton: PropTypes.bool,
};

export default function Like({ item, asButton }) {
	useChanges(item);

	const { LikeCount } = item;

	const [loading, setLoading] = useState(false);

	const onClick = e => {
		e.preventDefault();
		e.stopPropagation();

		let { item } = this.props;

		setLoading(true);
		item.like().then(() => setLoading(false));
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
		<Loading.Placeholder loading={loading} fallback={<></>}>
			<Tag {...extraProps} className={cls} onClick={onClick}>
				{count}
			</Tag>
		</Loading.Placeholder>
	);
}
