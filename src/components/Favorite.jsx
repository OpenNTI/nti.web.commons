import PropTypes from 'prop-types';
import cx from 'classnames';

import { Button, useChanges } from '@nti/web-core';

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

	useChanges(item);

	const onClick = e => {
		e.preventDefault();
		e.stopPropagation();

		item.favorite();
	};

	const Tag = asButton ? Button : 'a';
	const extraProps = asButton ? { plain: true } : { href: '#' };

	return <Tag {...extraProps} className={cls} onClick={onClick} />;
}
