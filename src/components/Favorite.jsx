import PropTypes from 'prop-types';

import { Button, useChanges } from '@nti/web-core';

const Element = styled(Button, { allowAs: true }).attrs({ plain: true })`
	position: relative;
	display: inline-block;
	margin: 0 10px 0 0;
	padding: 0;
	height: 24px;
	width: 18px;
	cursor: pointer;
	vertical-align: top;

	&::after {
		background-image: url('./assets/favorite.png');
		content: '';
		overflow: hidden;
		position: absolute;
		height: 24px;
		width: 12px;
		top: -1px;
		left: 3px;
	}

	&.active::after {
		background-image: url('./assets/favorite_active.png');
	}
`;

Favorite.propTypes = {
	item: PropTypes.object.isRequired,
};

export default function Favorite({ item, ...props }) {
	useChanges(item);

	const onClick = e => {
		e?.preventDefault();
		e?.stopPropagation();
		item?.favorite();
	};

	return (
		<Element
			{...props}
			className="favorite"
			onClick={onClick}
			active={item?.hasLink('unfavorite')}
		/>
	);
}
