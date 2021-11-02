import PropTypes from 'prop-types';
import { useState } from 'react';
import cx from 'classnames';

import { Button, useChanges } from '@nti/web-core';

import Loading from './loading-indicators';

import './Favorite.scss';

Favorite.propTypes = {
	item: PropTypes.object.isRequired,
	asButton: PropTypes.bool,
};

export default function Favorite({ item, asButton }) {
	let cls = cx('favorite', {
		active: item.hasLink('unfavorite'),
		'button-like': asButton,
	});

	const [loading, setLoading] = useState(false);

	useChanges(item);

	const onClick = e => {
		e.preventDefault();
		e.stopPropagation();

		setLoading(true);
		item.favorite().then(() => setLoading(false));
	};

	const Tag = asButton ? Button : 'a';
	const extraProps = asButton ? { plain: true } : { href: '#' };

	return (
		<Loading.Placeholder loading={loading} fallback={<></>}>
			<Tag {...extraProps} className={cls} onClick={onClick} />
		</Loading.Placeholder>
	);
}
